import { Request, Response } from 'express';
import mongoose, { isValidObjectId, Types } from 'mongoose'; 
import { getQuestions } from './questionController';
import Game from '../models/gameModel';

interface RequestWithUserId extends Request {
  userId?: string;
}

export const joinGame = async (req: RequestWithUserId, res: Response) => {
  try {
    const { roomId } = req.body;
    const userId = req.userId;

    const game = await Game.findOne({ gameId: roomId });

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.players.length >= 3 || game.players.includes(new mongoose.Types.ObjectId(userId))) {
      return res.status(400).json({ message: 'You have already joined this game' });
    }

    if (userId) {
      game.players.push(new mongoose.Types.ObjectId(userId));
      await game.save();
    }

    res.json({ message: 'Joined the game successfully', game });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteGame = async (req: RequestWithUserId, res: Response) => {
  try {
    const { roomId } = req.body;
    const userId = req.userId;

    const game = await Game.findOne({gameId:roomId});

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this game' });
    }

    await Game.findByIdAndDelete(game._id);

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

    console.log(userId);
    
    const existingGame = await Game.findOne({ gameId: roomId });

    if (existingGame) {
      console.log("Game already exists");
      return res.status(403).json({ message: 'Game with this ID already exists' });
    }

    const numberOfQuestionsString = process.env.QUESTIONS_NUMBER || '5';
    const numberOfQuestions = parseInt(numberOfQuestionsString, 10);

    const questions = await getQuestions(numberOfQuestions);

    const newGame = await Game.create({
      gameId: roomId,
      createdBy: new mongoose.Types.ObjectId(userId),
      players: [],
      questions: questions,
      status: 'waiting',
    });

    res.json({ message: 'Game created successfully', game: newGame });
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