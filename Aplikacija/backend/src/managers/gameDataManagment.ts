import { GameData } from '../models/gameModel/gameData';
import { IQuestion } from '../models/questionModel';
import store, { Store } from './store'; 

export class GameDataManagement {
    private store: Store;

    constructor(store: Store) {
        this.store = store;
    }

    public addGameData(roomId: string, gameData: GameData) {
        if (store.getGame(roomId))
            throw new Error(`Game with ID ${roomId} already exists`);
        
         store.addGame(roomId, gameData); 
    }

    public getGameData(gameId: string): GameData | null {
        return store.getGame(gameId);
    }

    public getNextQuestion(roomId: string): IQuestion | null {
        const gameData = store.getGame(roomId);
        if (!gameData) {
            console.error('Game not found for roomId:', roomId);
            return null;
        }

        if (gameData.currentQuestionIndex < gameData.questions.length) {
            const nextQuestion = gameData.questions[gameData.currentQuestionIndex];
            gameData.currentQuestionIndex++;
            return nextQuestion;
        } else {
            return null;
        }
    }

    public getCorrectAnswerIndex(gameData: GameData): number {
        let qNumber = gameData.currentQuestionIndex;

        if (qNumber <= 0 || qNumber > gameData.questions.length) {
            console.error(`Invalid question number: ${qNumber}`);
            return -1;
        }

        return gameData.questions[qNumber - 1].correctAnswerIndex;
    }

}
