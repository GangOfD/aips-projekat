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
const store_1 = __importDefault(require("../store/store"));
const gameData_1 = require("../models/gameData");
const convertor_1 = __importDefault(require("../utils/convertor"));
class GameStateManager {
    constructor(io, roomId) {
        this.questionTimer = null;
        // private roomId: string;
        this.counter = 0;
        this.io = io;
        // this.roomId = roomId;
    }
    startGameCycle(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const gameData = yield (0, gameData_1.prepareGameData)(roomId);
            if (!gameData) {
                console.error("Failed to start game cycle: game data could not be prepared.");
                return;
            }
            store_1.default.addGameData(roomId, gameData);
            this.sendQuestion(roomId);
        });
    }
    sendQuestion(roomId) {
        if (store_1.default.isGameOver(roomId)) {
            this.showFinalTable(roomId);
            return;
        }
        const question = store_1.default.getNextQuestion(roomId);
        if (question) {
            const questionDto = (0, convertor_1.default)(question);
            this.io.emit('newQuestion', questionDto);
            this.questionTimer = setTimeout(() => {
                this.showResults(roomId);
            }, 10000);
        }
        else {
            this.showFinalTable(roomId);
        }
    }
    showResults(roomId) {
        //const results = Store.calculateResultsForQuestion(this.currentQuestion);
        // this.io.emit('questionResults', results);
        // After 5 seconds, send the next question or end game
        setTimeout(() => {
            this.sendQuestion(roomId);
        }, 5000);
    }
    //evaluateUserResponse(roomId, userId,answerNumber){}
    showFinalTable(roomId) {
        const finalScores = store_1.default.getFinalScores(roomId);
        this.io.emit('gameOver', finalScores);
        // Store.resetGame();  // Reset the game state for a new game
    }
}
exports.default = GameStateManager;
