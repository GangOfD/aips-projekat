"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Store {
    constructor() {
        this.userStates = new Map();
        this.games = new Map();
    }
    addGameData(roomId, gameData) {
        if (this.games.get(roomId))
            throw new Error(`Game with an ID ${roomId} already exists`);
        this.games.set(roomId, gameData);
    }
    getGameData(gameId) {
        return this.games.get(gameId);
    }
    updateUserState(userId, updates) {
        const userState = this.userStates.get(userId);
        if (userState) {
            this.userStates.set(userId, Object.assign(Object.assign({}, userState), updates));
        }
        else {
            console.error(`UserState not found for userId: ${userId}`);
        }
    }
    getUserState(userId) {
        return this.userStates.get(userId);
    }
    getNextQuestion(roomId) {
        const gameData = this.games.get(roomId);
        if (!gameData) {
            console.error('Game not found for roomId:', roomId);
            return null;
        }
        if (gameData.currentQuestionIndex < gameData.questions.length) {
            const nextQuestion = gameData.questions[gameData.currentQuestionIndex];
            gameData.currentQuestionIndex++;
            return nextQuestion;
        }
        else {
            return null;
        }
    }
    recordUserAnswer(roomId, userId, currentAnswer) {
        const game = this.getGame(roomId);
        if (!game) {
            return;
        }
        const userState = game.players.get(userId);
        if (!userState) {
            console.log(`User ${userId} not found in game ${roomId}.`);
            return;
        }
        userState.currentAnswer = currentAnswer;
    }
    calculateResultsForQuestion(roomId) {
    }
    isGameOver(roomId) {
        const gameData = this.games.get(roomId);
        if (!gameData) {
            console.error('Game not found for roomId:', roomId);
            return true;
        }
        return gameData.currentQuestionIndex >= gameData.questions.length;
    }
    getFinalScores(roomId) {
        const gameData = this.games.get(roomId);
        if (!gameData) {
            console.error('Game not found for roomId:', roomId);
            return {};
        }
        // Initialize an object to hold final scores
        const finalScores = {};
        // Assuming each response in gameData.responses has a userId and a score
        gameData.responses.forEach((responses, questionId) => {
            responses.forEach((response) => {
                if (!finalScores[response.userId]) {
                    finalScores[response.userId] = 0;
                }
                // Add the score for this response to the user's total score
                finalScores[response.userId] += this.calculateScoreForResponse(response);
            });
        });
        return finalScores;
    }
    calculateScoreForResponse(response) {
        return 10;
    }
    getGame(roomId) {
        return this.games.get(roomId) || null;
    }
}
exports.default = new Store();
