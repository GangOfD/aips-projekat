import { Model } from 'mongoose';
import { IPlayer } from '../models/playerModel'; 

export class PlayerRepository {
  private playerModel: Model<IPlayer>;

  constructor(playerModel: Model<IPlayer>) {
    this.playerModel = playerModel;
  }

  async getAll(): Promise<IPlayer[]> {
    try {
      const players = await this.playerModel.find();
      return players;
    } catch (error:any) {
      throw new Error(`Error while fetching players: ${error.message}`);
    }
  }

  public async getById(id: string): Promise<IPlayer | null> {
    try {
      const player = await this.playerModel.findById(id);
      return player;
    } catch (error:any) {
        throw new Error(`Error while fetching player by ID: ${error.message}`);
    }
  }

  async create(player: IPlayer): Promise<IPlayer> {
    try {
      const createdPlayer = await this.playerModel.create(player);
      return createdPlayer;
    } catch (error:any) {
        throw new Error(`Error while creating player: ${error.message}`);
    }
  }

  async update(id: string, playerData: Partial<IPlayer>): Promise<IPlayer | null> {
    try {
      const updatedPlayer = await this.playerModel.findByIdAndUpdate(id, playerData, { new: true });
      return updatedPlayer;
    } catch (error:any) {
        throw new Error(`Error while updating player: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.playerModel.findByIdAndDelete(id);
    } catch (error:any) {
        throw new Error(`Error while deleting player: ${error.message}`);
    }
  }

  async findByEmail(email: string): Promise<IPlayer | null> {
    try {
      const player = await this.playerModel.findOne({ email });
      return player;
    } catch (error: any) {
      throw new Error(`Error while fetching player by email: ${error.message}`);
    }
  }
}
