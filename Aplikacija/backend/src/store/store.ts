import Game from '../models/gameModel';
import { IQuestion } from '../models/questionModel'
import  {GameData, UserResponse } from '../models/gameData';

export interface UserState {
    score: number;
    currentAnswer: number | null;
    answerTime: number | null;
    hasAnswered: boolean;
    isCorrect: boolean;
}


class Store {

    private userStates: Map<string, UserState>;
    private games: Map<string, GameData>;

    constructor() {
        this.userStates = new Map();
        this.games = new Map();
    }

    public addGameData(roomId: string, gameData: GameData) {
        if(this.games.get(roomId))
        throw new Error(`Game with an ID ${roomId} already exists`);
      
        this.games.set(roomId,gameData);
      }

    public getGameData(gameId: string): GameData | undefined {
        return this.games.get(gameId);
    }

    public updateUserState(userId: string, updates: Partial<UserState>): void {
        const userState = this.userStates.get(userId);
        if (userState) {
            this.userStates.set(userId, { ...userState, ...updates });
        } else {
            console.error(`UserState not found for userId: ${userId}`);
        }
    }

    public getUserState(userId: string): UserState | undefined {
        return this.userStates.get(userId);
    }


    public getNextQuestion(roomId: string): IQuestion | null {
        const gameData = this.games.get(roomId);
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

    public recordUserAnswer(roomId:string,userId:string,currentAnswer:number| null){
        const game=this.getGame(roomId);
        if(!game){
            return;
        }

        const userState = game.players.get(userId);
        if (!userState) {
            console.log(`User ${userId} not found in game ${roomId}.`);
            return; 
        }
        userState.currentAnswer = currentAnswer;

    }

    calculateResultsForQuestion(roomId: string): any {

    }


    public isGameOver(roomId: string): boolean {
        const gameData = this.games.get(roomId);
        if (!gameData) {
            console.error('Game not found for roomId:', roomId);
            return true;
        }

        return gameData.currentQuestionIndex >= gameData.questions.length;
    }

    public getFinalScores(roomId: string): { [userId: string]: number } {
        const gameData = this.games.get(roomId);
        if (!gameData) {
            console.error('Game not found for roomId:', roomId);
            return {};
        }

        // Initialize an object to hold final scores
        const finalScores: { [userId: string]: number } = {};

        // Assuming each response in gameData.responses has a userId and a score
        gameData.responses.forEach((responses: any, questionId: any) => {
            responses.forEach((response: any) => {
                if (!finalScores[response.userId]) {
                    finalScores[response.userId] = 0;
                }
                // Add the score for this response to the user's total score
                finalScores[response.userId] += this.calculateScoreForResponse(response);
            });
        });

        return finalScores;
    }
    calculateScoreForResponse(response: UserResponse): number {
        return 10;
    }


    public getGame(roomId: string): GameData | null {
        return this.games.get(roomId) || null;
    }

}
export default new Store();
