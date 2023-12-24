import mongoose, { Schema, Document } from 'mongoose';

interface IPlayer extends Document {
  username: string;
  email: string;
  password: string;
  age?: number;
}

const playerSchema: Schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    trim: true, 
    lowercase: true, 
  },
  password: {
    type: String,
    required: true,
    minlength: 6, 
  },
  age: {
    type: Number,
    default: 0,
    min: 3,
    max: 103,
  },
});

const Player = mongoose.model<IPlayer>('Player', playerSchema);

export default Player;
