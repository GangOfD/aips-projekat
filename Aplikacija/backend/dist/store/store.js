"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Store {
    constructor() {
        this.games = {};
        this.userStates = {};
        // ... other methods and functionalities ...
    }
    initStore(roomId) { }
    setGame(roomId, gameData) {
        this.games[roomId] = Object.assign(Object.assign({}, gameData), { currentQuestionIndex: 0, responses: {} });
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
        // Logic to calculate results based on answers stored in userStates
        // and the current question in the game data
        // Return calculated results
    }
    isGameOver(roomId) {
        const game = this.games[roomId];
        if (!game) {
            return true;
        }
        // Define game over conditions, e.g., all questions answered
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
