import { Request, Response } from 'express';
import mongoose, { isValidObjectId, Types } from 'mongoose'; 
import { fetchQuestionsForGame, getQuestions } from './questionController';
import Game, { IGame } from '../models/gameModel';
import { GameRepo as GameRepository} from '../repository/gameRepository';
import { SocketEvent } from '../socket-decorators';
import { io } from '../app';
import { Socket } from 'socket.io';
import Store from '../store/store'
import GameStateManager from '../store/gameStateManager'
import {gameDto} from '../models/gameDto'
import Player from '../models/playerModel';



const gameRepo = new GameRepository(Game);

interface RequestWithUserId extends Request {
  userId?: string;
}

// export const joinGame = async (req: RequestWithUserId, res: Response) => {
//   try {
//     const { roomId } = req.body;
//     const userId = req.userId;

//     const game = await gameRepo.getById(roomId);
//     if (!game) {
//       return res.status(404).json({ message: 'Game not found' });
//     }

//     const userIdObj = new mongoose.Types.ObjectId(userId);
//     if (game.players.length >= 3 || game.players.includes(userIdObj)) {
//       return res.status(400).json({ message: 'You have already joined this game' });
//     }

//     if (userId) {
//       const updatedGame = await gameRepo.update(game._id, { 
//         players: [...game.players, userIdObj] 
//       });
//       console.log("Joined")
//       res.json({ message: 'Joined the game successfully', game: updatedGame });
//     } else {
//       res.status(400).json({ message: 'User ID is required' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
export const joinGame = async (data: { roomId: string, userId: string }, socket: Socket) => {
  try {
    const { roomId, userId } = data;

    const game = await gameRepo.getById(roomId);
    if (!game) {
      socket.emit('joinError', 'Game not found');
      return;
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);
    if (game.players.includes(userIdObj)) {
      socket.emit('joinError', 'You have already joined this game');
      return;
    }

    if (game.players.length == 4) {
      socket.emit('joinError', 'Game is already full');
      return;
    }

    const updatedGame = await gameRepo.update(game._id, { 
      players: [...game.players, userIdObj]
    });
    //msm da prvo trebas da sejvujes bazu pa onda da mi vratis igrace
    const playerIds = game.players;
    const players = await Player.find({ _id: { $in: playerIds } });
    const playerNames = players.map(player => player.username);
    let DTO: gameDto = {
      createdAt: game.createdAt,
      players:playerNames,
      status:game.status,
      gameId:game.gameId,
      createdBy: (await Player.findById(game.createdBy))?.username ?? "Unknown"
    };

    if (updatedGame?.players.length == 4) {
      console.log("Socket is emitting, hi there");
      socket.emit('gameStarted', DTO); 
      socket.broadcast.emit('gameStarted', updatedGame);   
      const gameStateManager = new GameStateManager(io, roomId);
      await gameStateManager.startGameCycle(roomId);

    } else {
      socket.emit('gameJoined', { DTO });
      socket.broadcast.emit('playerJoined', { DTO });
    }
  } catch (error) {
    console.error('Error in joinGame:', error);
    socket.emit('joinError', 'Error joining game');
  }
};



export const deleteGame = async (req: RequestWithUserId, res: Response) => {
  try {
    const { roomId } = req.body;
    const userId = req.userId;

    // const game = await Game.findOne({gameId:roomId});
    const game = await gameRepo.getById(roomId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this game' });
    }

    // await Game.findByIdAndDelete(game._id);
    await gameRepo.delete(game._id);

    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createGame = async (req: RequestWithUserId, res: Response) => {
  try {
    const { roomId } = req.body;
    const userId = req.userId;

    console.log(roomId, typeof roomId)
    const existingGame = await gameRepo.getById(roomId);
    if (existingGame) {
      return res.status(403).json({ message: 'Game with this ID already exists' });
    }

    const numberOfQuestions = parseInt(process.env.numberOfQuestions || '5', 10);
    if (isNaN(numberOfQuestions) || numberOfQuestions <= 0) {
      return res.status(400).json({ message: 'Invalid number of questions' });
    }

    const questions = await fetchQuestionsForGame(numberOfQuestions);

    const newGame: Partial<IGame> = {
      gameId: roomId,
      createdBy: new mongoose.Types.ObjectId(userId),
      players: [],
      questions: questions.map(q => q._id),
      status: 'waiting',
      createdAt: new Date() 
    };

    const createdGame = await gameRepo.create(newGame);

    res.json({ message: 'Game created successfully', game: createdGame });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




export const getAllGames = async (req: RequestWithUserId, res: Response) => {
  try {
    const userId = req.userId;

    const games = await Game.find({ players: new mongoose.Types.ObjectId(userId) });

    res.json({ games });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const getAllAvailableGames = async (req: RequestWithUserId, res: Response) => {
    try {
      //const userId = req.userId;
  
      const availableGames = await Game.find({
        status: 'waiting',
      //  players: { $not: { $in: [new mongoose.Types.ObjectId(userId)] } },
      });
  
      res.json({ availableGames });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

