import Game from '../models/gameModel';
import {IQuestion} from '../models/questionModel'
import GameData from '../models/gameData';

export interface UserState {
    score: number;
    currentAnswer:any;
    // Additional properties as needed
}

 class Store {
    private games: { [roomId: string]: GameData } = {};
    private userStates: { [userId: string]: UserState } = {};

    async initStore(roomId: any) {
        // const game = await gameRepo.getById(roomId);
        const game=await Game.findOne({gameId:roomId})
        if (game != null) {
            this.games[roomId] = await GameData.fromMongoEntity(game);
            this.games[roomId].currentQuestionIndex=0;
        }
        console.log("Ready ", this.games[roomId])
    }

    public getNextQuestion(roomId: string): IQuestion | null {
        const game = this.games[roomId];
        if (!game || game.currentQuestionIndex >= game.questions.length - 1) {
            return null;
        }
        game.currentQuestionIndex++;
        return game.questions[game.currentQuestionIndex];
    }

    calculateResultsForQuestion(roomId: string): any {

    }

    isGameOver(roomId: string): boolean {
        const game = this.games[roomId];
        if (!game) {
            return true;
        }
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
