import mongoose, { Document, Schema } from 'mongoose';

interface IPlayerResponse extends Document {
    player: mongoose.Types.ObjectId;
    points: number;
}

interface IQuestion extends Document {
    question: mongoose.Types.ObjectId;
    responses: IPlayerResponse[];
}

interface IGame extends Document {
    gameId: string; 
    createdBy: mongoose.Types.ObjectId;
    players: mongoose.Types.ObjectId[];
    questions: mongoose.Types.ObjectId[]; 
    status: 'waiting' | 'inProgress' | 'completed';
    createdAt: Date;
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
    status: { type: String, enum: ['waiting', 'inProgress', 'completed'], default: 'waiting' },
    createdAt: { type: Date, default: Date.now }
});

const Game = mongoose.model<IGame>('Game', gameSchema);

export default Game;
