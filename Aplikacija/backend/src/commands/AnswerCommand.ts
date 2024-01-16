import ICommand from './ICommand';
import Store from '../store/store';
import { verifyToken } from '../middleware/authenticate';

export default class AnswerCommand implements ICommand {
    private userId: string | null;
    private answerValue: null | number; 
    private gameId: string;


    constructor(token: string, answerValue: null | number,gameId:string) {
        this.userId = verifyToken(token); 
        this.answerValue = answerValue;
        this.gameId = gameId;
    }

    execute(): void {
        if (this.userId === null) {
            throw new Error('Invalid token');
        }
       Store.recordUserAnswer(this.gameId,this.userId,this.answerValue)

    }

    private checkAnswerCorrectness(questionId: string, answerValue: string | number): boolean {
        // Implement the logic to check if the answer is correct
        // This might involve fetching the question details and comparing the answer
        return true; // Placeholder return value
    }
}
