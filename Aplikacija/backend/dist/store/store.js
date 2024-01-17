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
            throw new Error('Game not found -recordUserAnswer');
            // return;
        }
        const userState = game.players.get(userId);
        if (!userState) {
            console.log(`User ${userId} not found in game ${roomId}.`);
            throw new Error('userState not found -recordUserAnswer');
            // return; 
        }
        userState.currentAnswer = currentAnswer;
        userState.answerTime = Date.now();
        console.log("Korisnikov odgovor je upravo zabelezen.", userState.answerTime, " i ", userState.currentAnswer);
    }
    getScoreboardTable(roomId) {
        const gameData = this.games.get(roomId);
        if (!gameData) {
            throw new Error('Game not found');
        }
        const results = {
            gameId: roomId,
            questionsAsked: gameData.currentQuestionIndex,
            scoreBoard: []
        };
        gameData.players.forEach((userState, userId) => {
            const username = userState.username;
            const points = userState.score;
            results.scoreBoard.push({ username, points });
        });
        results.scoreBoard.sort((a, b) => b.points - a.points);
        return results;
    }
    isGameOver(roomId) {
        const gameData = this.games.get(roomId);
        if (!gameData) {
            console.error('Game not found for roomId:', roomId);
            return true;
        }
        return gameData.currentQuestionIndex >= gameData.questions.length;
    }
    getCorrectAnswerIndex(gameData) {
        let qNumber = gameData.currentQuestionIndex;
        if (qNumber <= 0 || qNumber > gameData.questions.length) {
            console.error(`Invalid question number: ${qNumber}`);
            return -1;
        }
        return gameData.questions[qNumber - 1].correctAnswerIndex;
    }
    updateScoresAfterQuestion(roomId) {
        const gameData = this.games.get(roomId);
        if (!gameData) {
            console.error('Game not found for roomId:', roomId);
            return;
        }
        const correctAnswerIndex = this.getCorrectAnswerIndex(gameData);
        this.assignPointsToPlayers(gameData, correctAnswerIndex);
    }
    assignPointsToPlayers(gameData, correctAnswerIndex) {
        const correctResponses = this.getCorrectResponses(gameData, correctAnswerIndex);
        this.assignPointsForCorrectAnswers(correctResponses);
        this.assignPointsForIncorrectAndNoAnswers(gameData, correctAnswerIndex);
    }
    getCorrectResponses(gameData, correctAnswerIndex) {
        return Array.from(gameData.players)
            .filter(([_, userState]) => userState.currentAnswer === correctAnswerIndex)
            .sort((a, b) => { var _a, _b; return ((_a = a[1].answerTime) !== null && _a !== void 0 ? _a : Number.MAX_VALUE) - ((_b = b[1].answerTime) !== null && _b !== void 0 ? _b : Number.MAX_VALUE); });
    }
    assignPointsForCorrectAnswers(correctResponses) {
        const pointsForCorrect = [4, 3, 2, 1];
        correctResponses.forEach(([userId, userState], index) => {
            var _a;
            userState.score += (_a = pointsForCorrect[index]) !== null && _a !== void 0 ? _a : 1;
        });
    }
    assignPointsForIncorrectAndNoAnswers(gameData, correctAnswerIndex) {
        gameData.players.forEach((userState) => {
            if (userState.currentAnswer !== correctAnswerIndex && userState.currentAnswer !== null) {
                userState.score -= 1;
            }
        });
    }
    getGame(roomId) {
        return this.games.get(roomId) || null;
    }
}
exports.default = new Store();
