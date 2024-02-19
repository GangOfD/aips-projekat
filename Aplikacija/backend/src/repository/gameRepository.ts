import mongoose, { Model } from 'mongoose';
import { IGame } from '../models/gameModel/gameModel';
import { ENV } from '../enviroments/constants';

export class GameRepo {
  private gameModel: Model<IGame>; 

  constructor(gameModel: Model<IGame>) {
    this.gameModel = gameModel;
  }

  async getAll(): Promise<IGame[]> {
    try {
      const games = await this.gameModel.find();
      return games;
    } catch (error: any) {
      throw new Error(`Error while fetching games: ${error.message}`);
    }
  }

    async getById(roomId: string): Promise<IGame | null> {
    try {
      const game = await this.gameModel.findOne({ gameId: roomId });
      return game;
    } catch (error:any) {
      throw new Error(`Error while fetching game by room ID: ${error.message}`);
    }
  }
  
  async getGamesByStatus(status:string) {
    try {
      return await this.gameModel.find({ status: status }).select('gameId createdAt');
    } catch (error) {
        console.error('Error fetching games by status:', error);
        throw error; 
    }
}

  async create(game: Partial<IGame>): Promise<IGame> {
    try {
      const createdGame = await this.gameModel.create(game);
      return createdGame;
    } catch (error: any) {
      throw new Error(`Error while creating game: ${error.message}`);
    }
  }

  async update(id: string, updateData: Partial<IGame>): Promise<IGame | null> {
    return this.gameModel.findByIdAndUpdate(id, updateData, { new: true });
  }
  

  async delete(id: string): Promise<void> {
    try {
      await this.gameModel.findByIdAndDelete(id);
    } catch (error: any) {
      throw new Error(`Error while deleting game: ${error.message}`);
    }
  }

  async removePlayerFromGame(Game:IGame, playerId:string) {
    try {
        const game:IGame=Game;
        
        if (!game) {
            throw new Error('Game not found');
        }

        game.players = game.players.filter(p => p.toString() !== playerId);
        await game.save();

        return game; 
    } catch (error) {
        console.error('Error removing player from game:', error);
        throw error;
    }
}

async canStartGame(gameId: string): Promise<{ canStart: boolean, message: string }> {
  const game = await this.getById(gameId);

  if (!game) {
    console.log("Game not found")
      return { canStart: false, message: "Game not found" };
  }

  if (game.players?.length !== ENV.roomCapacity) {
      let maks=process.env.numberOfPlayers
      console.log("Game must have exactly 4 players")
      return { canStart: false, message: "Game must have exactly 4 players" };
  }

  if (game.status !== ENV.waitingMessage) {
    console.log("Game is not in waiting status ", game.status, ENV.waitingMessage)
      return { canStart: false, message: "Game is not in waiting status" };
  }

  return { canStart: true, message: "" }; 
}
}
