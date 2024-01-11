"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = __importDefault(require("../store/store"));
class GameStateManager {
    constructor(io, roomId) {
        this.questionTimer = null;
        this.io = io;
        this.roomId = roomId;
    }
    static startGameCycle(roomId) {
        store_1.default.initStore(roomId);
        console.log("game started, hello from gameStateManager");
        while (false) {
        }
    }
    showQuestion() {
        const question = store_1.default.getNextQuestion(this.roomId);
        if (question) {
            this.currentQuestion = question;
            this.io.emit('newQuestion', question); // Send question to players
            this.questionTimer = setTimeout(() => {
                this.showResults();
            }, 10000); // 10 seconds to answer
        }
        else {
            this.showFinalTable(); // No more questions, show final results
        }
    }
    //Shows results after 5 seconds
    showResults() {
        const results = store_1.default.calculateResultsForQuestion(this.currentQuestion);
        this.io.emit('questionResults', results);
        setTimeout(() => {
            if (store_1.default.isGameOver(this.roomId)) {
                this.showFinalTable();
            }
            else {
                this.showQuestion();
            }
        }, 5000); // Show results for 5 seconds before next question or ending game
    }
    //TO DO: listener that checks whether store.ts signals that game is over
    //Shows final table after the game is finished
    showFinalTable() {
        const finalScores = store_1.default.getFinalScores(this.roomId);
        this.io.emit('gameOver', finalScores);
        //Store.resetGame();  // Reset the game state for a new game
    }
}
exports.default = GameStateManager;
