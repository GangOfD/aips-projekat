import mongoose, { Document, Schema } from 'mongoose';
import { PredefinedTags } from '../tags/enumTags';
import {ENV} from '../../enviroments/constants'
import { GameState, GameStatus } from '../gameStates';


interface IPlayerResponse extends Document {
    player: mongoose.Types.ObjectId;
    points: number;
}

interface IQuestion extends Document {
    question: mongoose.Types.ObjectId;
    responses: IPlayerResponse[];
}

export interface IGame extends Document {
    gameId: string; 
    createdBy: mongoose.Types.ObjectId;
    players: mongoose.Types.ObjectId[];
    questions: mongoose.Types.ObjectId[]; 
    status: GameState;
    createdAt: Date;
    tags: PredefinedTags[];
    gamePhase:GameState;
}

const playerResponseSchema = new Schema<IPlayerResponse>({
    player: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    points: { type: Number, required: true, default: 0 }
});

const questionSchema = new Schema<IQuestion>({
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    responses: [playerResponseSchema]
});

const gameSchema = new Schema<IGame>({
    gameId: { type: String, required: true, unique: true }, // po ovome korisnici pronalaze Game
    createdBy: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }], 
    status: { type: String, enum: Object.values(GameState), default: GameState.Waiting },
    createdAt: { type: Date, default: Date.now },
    tags: {/*TO IMPLEMENT*/}
});

const Game = mongoose.model<IGame>('Game', gameSchema);

export default Game;
