import {CommandHistory} from './CommandHistory'
import { Store } from '../managers/store';
export default abstract class ICommand {
    protected store: Store;

    constructor(public userId: string, protected gameId: string,store:Store) {
         this.userId=userId;
         this.gameId=gameId;
         this.store = store;

    }

    abstract execute():void;
    //abstract undo():void;
}


export class CommandSaver {
    
}
