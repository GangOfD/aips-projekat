
import ICommand from './ICommand';
import {Store} from '../managers/store';
import { CommandHistory } from './CommandHistory';

export default class UndoAnswerCommand extends ICommand {
    constructor(userId: string,gameId:string,store:Store) {
        super(userId, gameId, store);

    }
    execute(): void {
        // Store.updateUserState(this.userId, { currentAnswer: null });
         //CommandHistory.UndoLatestCommand();
    }
    undo():void{

    }
}
