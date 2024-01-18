import ICommand from './ICommand';
import Store from '../store/store';
import { verifyToken } from '../middleware/authenticate';

export default class AnswerCommand implements ICommand {
    private userId: string | null;
    private answerValue: null | number; 
    private gameId: string;


    constructor(userId: string, answerValue: null | number,gameId:string) {
        this.userId=userId;
        this.answerValue = answerValue;
        this.gameId = gameId;
    }

    execute(): void {
        if (this.userId === null) {
            throw new Error('Invalid token');
        }
       Store.recordUserAnswer(this.gameId,this.userId,this.answerValue)

    }
}
