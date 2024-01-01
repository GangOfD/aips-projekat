import mongoose, { Model } from 'mongoose';
import { IGame } from '../models/gameModel';

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
      console.log("Querying for roomId:", roomId);
      const game = await this.gameModel.findOne({ gameId: roomId });
      console.log("Found game:", game);
      return game;
    } catch (error:any) {
      throw new Error(`Error while fetching game by room ID: ${error.message}`);
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
}
