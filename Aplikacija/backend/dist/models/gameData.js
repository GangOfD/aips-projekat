"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareGameData = exports.GameData = void 0;
const gameModel_1 = __importDefault(require("./gameModel"));
class GameData {
    constructor(questions, playersData) {
        this.players = playersData;
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.responses = new Map();
    }
    recordResponse(questionId, response) {
        var _a;
        if (!this.responses.has(questionId)) {
            this.responses.set(questionId, []);
        }
        (_a = this.responses.get(questionId)) === null || _a === void 0 ? void 0 : _a.push(response);
    }
}
exports.GameData = GameData;
function prepareGameData(roomId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const gameDataFromDB = yield gameModel_1.default.findOne({ gameId: roomId }).populate('questions');
            if (!gameDataFromDB)
                return null;
            if (!gameDataFromDB.questions || !Array.isArray(gameDataFromDB.questions)) {
                throw new Error('Questions could not be populated');
            }
            const questions = gameDataFromDB.questions;
            const playersData = new Map();
            gameDataFromDB.players.forEach(playerId => {
                const userState = {
                    score: 0,
                    currentAnswer: null,
                    answerTime: null,
                    hasAnswered: false,
                    isCorrect: false
                };
                playersData.set(playerId.toString(), userState);
            });
            return new GameData(questions, playersData);
        }
        catch (error) {
            console.error('Error preparing game data:', error);
            return null;
        }
    });
}
exports.prepareGameData = prepareGameData;
