import {IQuestion} from '../models/questionModel'
interface UserResponse {
    answer: string;
    timestamp: number;
}

interface GameData {
    players: string[];
    questions: IQuestion[];
    currentQuestionIndex: number;
    responses: { [questionId: string]: UserResponse[] };
    // Additional properties as needed
}

interface UserState {
    score: number;
    currentAnswer:any;
    // Additional properties as needed
}

class Store {
    private games: { [roomId: string]: GameData } = {};
    private userStates: { [userId: string]: UserState } = {};

    initStore(roomId:any){}
    setGame(roomId: string, gameData: any): void {
        this.games[roomId] = {
            ...gameData,
            currentQuestionIndex: 0,
            responses: {}
        };
    }

    getNextQuestion(roomId: string): IQuestion | null {
        const game = this.games[roomId];
        if (!game || game.currentQuestionIndex >= game.questions.length - 1) {
            return null;
        }
        game.currentQuestionIndex++;
        return game.questions[game.currentQuestionIndex];
    }

    calculateResultsForQuestion(roomId: string): any {
        // Logic to calculate results based on answers stored in userStates
        // and the current question in the game data
        // Return calculated results
    }

    isGameOver(roomId: string): boolean {
        const game = this.games[roomId];
        if (!game) {
            return true;
        }
        // Define game over conditions, e.g., all questions answered
        return game.currentQuestionIndex >= game.questions.length - 1;
    }

    getFinalScores(roomId: string): any {
        // Calculate and return final scores for the game
        const game = this.games[roomId];
        if (!game) {
            return {};
        }
        // Logic to compile final scores
    }

    // ... other methods and functionalities ...
}

export default new Store();