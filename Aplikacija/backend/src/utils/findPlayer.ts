import Player from '../models/playerModel';
import mongoose from 'mongoose';

export const findPlayerByIdOrName = async (identifier: string): Promise<any> => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(identifier);

  let query;
  if (isValidObjectId) {
    query = { _id: identifier };
  } else {
    query = { username: identifier };
  }

  try {
    const player = await Player.findOne(query);
    return player;
  } catch (error) {
    console.error('Error finding player:', error);
    return null;
  }
};
