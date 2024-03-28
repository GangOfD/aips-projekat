
import ICommand from './ICommand';
import {Store} from '../managers/store';
import { CommandHistory } from './CommandHistory';
export default class UndoAnswerCommand extends ICommand {
    constructor(userId: string,gameId:string,store:Store) {
        super(userId, gameId, store);

    }
    execute(): void {
        //1. pronadji komandu u istoriji
        const commandHistory = CommandHistory.getInstance();
        const game=this.store.getGame(this.gameId)
        const command=commandHistory.getCommand(this.userId)


        //2.izbrisi je iz istorije
        if(command)
        commandHistory.deleteCommand(command)


        //3.updatuj store 
        this.store.gameLogic.undoUserAnswer(this.gameId,this.userId)

    }
    undo():void{

    }
}
