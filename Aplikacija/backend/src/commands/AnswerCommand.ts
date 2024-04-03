import ICommand from './ICommand';
import { Store } from '../managers/store';
import { CommandHistory } from './CommandHistory';

export default class AnswerCommand extends ICommand {
    private answerValue: null | number;     


    constructor(userId: string, answerValue: null | number,gameId:string,store:Store) {
        super(userId, gameId, store);

        this.answerValue = answerValue;
        this.gameId = gameId;
    }

    execute(): void {
        if (this.userId === null) {
            throw new Error('Invalid token');
        }
        const game = this.store.getGame(this.gameId);
        const commandHistory = CommandHistory.getInstance();
        commandHistory.addCommand(this)
        //game?.commandHistory.addCommand(this);     
        
       this.store.gameLogic.recordUserAnswer(this.gameId,this.userId,this.answerValue)

    }
    
}
