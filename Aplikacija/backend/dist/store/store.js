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
const gameModel_1 = __importDefault(require("../models/gameModel"));
const gameData_1 = __importDefault(require("../models/gameData"));
class Store {
    constructor() {
        this.games = {};
        this.userStates = {};
        // ... other methods and functionalities ...
    }
    initStore(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            // const game = await gameRepo.getById(roomId);
            const game = yield gameModel_1.default.findOne({ gameId: roomId });
            if (game != null) {
                this.games[roomId] = yield gameData_1.default.fromMongoEntity(game);
                this.games[roomId].currentQuestionIndex = 0;
            }
            console.log("Ready ", this.games[roomId]);
        });
    }
    getNextQuestion(roomId) {
        const game = this.games[roomId];
        if (!game || game.currentQuestionIndex >= game.questions.length - 1) {
            return null;
        }
        game.currentQuestionIndex++;
        return game.questions[game.currentQuestionIndex];
    }
    calculateResultsForQuestion(roomId) {
    }
    isGameOver(roomId) {
        const game = this.games[roomId];
        if (!game) {
            return true;
        }
        return game.currentQuestionIndex >= game.questions.length - 1;
    }
    getFinalScores(roomId) {
        // Calculate and return final scores for the game
        const game = this.games[roomId];
        if (!game) {
            return {};
        }
        // Logic to compile final scores
    }
}
exports.default = new Store();
