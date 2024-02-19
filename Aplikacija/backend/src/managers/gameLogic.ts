import { Store } from './store';
import { GameData } from '../models/gameModel/gameData';
import { UserState } from '../models/IUserState';
import { HostMessageParams } from '../models/hostModel';
import { GameRepo } from '../repository/gameRepository';
import {ENV} from '../enviroments/constants'
require('dotenv').config();


export class GameLogic {
    private store: Store;

    constructor(store: Store) {
        this.store = store;
    }

    public isGameOver(roomId: string): boolean {
        const gameData = this.store.getGame(roomId);
        if (!gameData) {
            console.error('Game not found for roomId:', roomId);
            return true;
        }
        return gameData.currentQuestionIndex >= gameData.questions.length;
    }

    public updateScoresAfterQuestion(roomId: string): void {
        const gameData = this.store.getGame(roomId);
        if (!gameData) {
            console.error('Game not found for roomId:', roomId);
            return;
        }

        this.assignPoints(roomId)
    }

    public recordUserAnswer(roomId: string, userId: string, currentAnswer: number | null) {
        const game = this.store.getGame(roomId);
        if (!game) {
            throw new Error('Game not found -recordUserAnswer')
            // return;
        }

        const userState = game.players.get(userId);
        if (!userState) {
            console.log(`User ${userId} not found in game ${roomId}.`);
            throw new Error('userState not found -recordUserAnswer')
            // return; 
        }
        userState.currentAnswer = currentAnswer;
        userState.hasAnswered= true;
        userState.answerTime = Date.now()
    }

      gameParamsFiller(roomId: string): HostMessageParams | undefined {
        const game = this.store.getGame(roomId);
    
        if (!game) {
            console.error('Game not found');
            return undefined;
        }
    
        const playerStates = Array.from(game.players.values());
    
        const correctAnswers = playerStates.map(state => state.isCorrect);
        const wrongAnswers = playerStates.map(state => !state.isCorrect);
        const playerNames = playerStates.map(state => state.username);
    
        const playerPositions = playerStates
            .map((state, index) => ({ index: index + 1, score: state.score }))
            .sort((a, b) => b.score - a.score)
            .map(player => player.index);
    
        return {
            correctAnswers,
            wrongAnswers,
            playerPositions,
            playerNames
        };
    }

     public assignPoints(gameId: string) {
        const gameData = this.store.getGame(gameId);
        if (!gameData) {
            console.error("Game not found");
            return;
        }

        const currentQuestionIndex = gameData.currentQuestionIndex;

        if (currentQuestionIndex < 0 || currentQuestionIndex >= gameData.questions.length) {
            console.error("Invalid question index");
            return;
        }

        const currentQuestion = gameData.questions[currentQuestionIndex];
        const correctAnswerIndex = currentQuestion.correctAnswerIndex;

        const sortedCorrectResponses = Array.from(gameData.players.entries())
            .filter(([_, userState]) => userState.currentAnswer === correctAnswerIndex)
            .sort((a, b) => (a[1].answerTime || Number.MAX_VALUE) - (b[1].answerTime || Number.MAX_VALUE));

        gameData.players.forEach((userState, userId) => {
            if (userState.currentAnswer === correctAnswerIndex) {
                let pointsAwarded = ENV.pointsCorrectAnswer; 
                const index = sortedCorrectResponses.findIndex(([id, _]) => id === userId);
                if (index === 0) pointsAwarded = ENV.pointsFirstCorrectAnswer;
                else if (index === 1) pointsAwarded = ENV.pointsSecondCorrectAnswer;
                else if (index === 2) pointsAwarded = ENV.pointsThirdCorrectAnswer;
                else if (index === 3) pointsAwarded = ENV.pointsForthCorrectAnswer;
                userState.score += pointsAwarded;
            } else if (userState.hasAnswered) {
                userState.score += ENV.pointsLostWrongAnswer; 
            }
            userState.currentAnswer = -1;
            userState.hasAnswered = false;
        });
    }

}
