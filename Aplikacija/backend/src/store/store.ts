import Game from '../models/gameModel';
import { IQuestion } from '../models/questionModel'
import  {GameData, UserResponse } from '../models/gameData';

export interface UserState {
    score: number;
    currentAnswer: number | null;
    answerTime: number | null;
    hasAnswered: boolean;
    isCorrect: boolean;
    username:string;
}


export interface resultState{ 
    gameId:string;
    questionsAsked:number;
    scoreBoard: { 
        username:string,
        points:number
    }[]
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
        userState.answerTime=Date.now()
        console.log("Korisnikov odgovor je upravo zabelezen." , userState.answerTime, " i ", userState.currentAnswer)

    }

    getScoreboardTable(roomId: string): resultState {
        const gameData = this.games.get(roomId);
        if (!gameData) {
            throw new Error('Game not found');
        }

        const results: resultState = {
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


    public isGameOver(roomId: string): boolean {
        const gameData = this.games.get(roomId);
        if (!gameData) {
            console.error('Game not found for roomId:', roomId);
            return true;
        }

        return gameData.currentQuestionIndex >= gameData.questions.length;
    }
    public getCorrectAnswerIndex(gameData: GameData): number {
        let qNumber = gameData.currentQuestionIndex;
        
        if (qNumber <= 0 || qNumber > gameData.questions.length) {
            console.error(`Invalid question number: ${qNumber}`);
            return -1; 
        }
    
        return gameData.questions[qNumber - 1].correctAnswerIndex;
    }
    
    public updateScoresAfterQuestion(roomId: string): void {
        const gameData = this.games.get(roomId);
        if (!gameData) {
            console.error('Game not found for roomId:', roomId);
            return;
        }

        const correctAnswerIndex = this.getCorrectAnswerIndex(gameData);
        this.assignPointsToPlayers(gameData, correctAnswerIndex);
    }

    private assignPointsToPlayers(gameData: GameData, correctAnswerIndex: number): void {
        const correctResponses = this.getCorrectResponses(gameData, correctAnswerIndex);
        this.assignPointsForCorrectAnswers(correctResponses);

        this.assignPointsForIncorrectAndNoAnswers(gameData, correctAnswerIndex);
    }

    private getCorrectResponses(gameData: GameData, correctAnswerIndex: number): [string, UserState][] {
        return Array.from(gameData.players)
            .filter(([_, userState]) => userState.currentAnswer === correctAnswerIndex)
            .sort((a, b) => (a[1].answerTime ?? Number.MAX_VALUE) - (b[1].answerTime ?? Number.MAX_VALUE));
    }

    private assignPointsForCorrectAnswers(correctResponses: [string, UserState][]): void {
        const pointsForCorrect = [4, 3, 2, 1];
        correctResponses.forEach(([userId, userState], index) => {
            userState.score += pointsForCorrect[index] ?? 1;
        });
    }

    private assignPointsForIncorrectAndNoAnswers(gameData: GameData, correctAnswerIndex: number): void {
        gameData.players.forEach((userState) => {
            if (userState.currentAnswer !== correctAnswerIndex && userState.currentAnswer !== null) {
                userState.score -= 1;
            }
        });
    }
    


    public getGame(roomId: string): GameData | null {
        return this.games.get(roomId) || null;
    }

}
export default new Store();
