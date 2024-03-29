"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const playerResponseSchema = new mongoose_1.Schema({
    player: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Player', required: true },
    points: { type: Number, required: true, default: 0 }
});
const questionSchema = new mongoose_1.Schema({
    question: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Question', required: true },
    responses: [playerResponseSchema]
});
const gameSchema = new mongoose_1.Schema({
    gameId: { type: String, required: true, unique: true }, // po ovome korisnici pronalaze Game
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Player', required: true },
    players: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Player' }],
    questions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Question' }],
    status: { type: String, enum: ['waiting', 'inProgress', 'completed'], default: 'waiting' },
    createdAt: { type: Date, default: Date.now },
});
const Game = mongoose_1.default.model('Game', gameSchema);
exports.default = Game;
