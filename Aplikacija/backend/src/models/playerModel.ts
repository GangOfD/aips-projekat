import mongoose, { Schema, Document } from 'mongoose';
import { validPassword } from '../utils/validPassword';
// interface Divison extends Document {

// }

export interface IPlayer extends Document {
  username: string;
  email: string;
  password: string;
  age?: number;
  winRate?:number;
  //division
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
    validate: { //CHECK THIS
         validator: validPassword, 
        message: 'Validate password message',
       },
  },
  age: {
    type: Number,
    default: 0,
    min: 3,
    max: 103,
  },
  winRate:{
    type:Number,
    default:undefined,
    min:0,
    max:100
  }
});

const Player = mongoose.model<IPlayer>('Player', playerSchema);

export default Player;
