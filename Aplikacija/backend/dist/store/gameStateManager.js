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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = __importDefault(require("../store/store"));
class GameStateManager {
    constructor(io, roomId) {
        this.questionTimer = null;
        this.counter = 0;
        this.io = io;
        this.roomId = roomId;
    }
    startGameCycle(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield store_1.default.initStore(roomId);
            console.log("Game started, hello from GameStateManager");
            this.sendQuestion();
        });
    }
    sendQuestion() {
        if (store_1.default.isGameOver(this.roomId)) {
            this.showFinalTable();
            return;
        }
        const question = store_1.default.getNextQuestion(this.roomId);
        if (question) {
            this.currentQuestion = question;
            const { correctAnswerIndex } = question, questionWithoutAnswer = __rest(question, ["correctAnswerIndex"]);
            this.io.emit('newQuestion', questionWithoutAnswer);
            this.questionTimer = setTimeout(() => {
                this.showResults();
            }, 10000);
        }
        else {
            this.showFinalTable();
        }
    }
    showResults() {
        const results = store_1.default.calculateResultsForQuestion(this.currentQuestion);
        this.io.emit('questionResults', results);
        // After 5 seconds, send the next question or end game
        setTimeout(() => {
            this.sendQuestion();
        }, 5000);
    }
    showFinalTable() {
        const finalScores = store_1.default.getFinalScores(this.roomId);
        this.io.emit('gameOver', finalScores);
        // Store.resetGame();  // Reset the game state for a new game
    }
}
exports.default = GameStateManager;
