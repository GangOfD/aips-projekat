import ICommand from './ICommand';
import { Store } from '../managers/store';
import keyToAnswerValue from '../commandAdapter';
import { CommandHistory } from './CommandHistory';

export class KeyPressCommand extends ICommand {
    constructor(userId: string, protected key: string, gameId: string, store: Store) {
        super(userId, gameId, store);
        this.key=key;
    }

    async execute(): Promise<void> {
        console.log(`User ${this.userId} pressed key ${this.key} for game ${this.gameId}`);
        const game = this.store.getGame(this.gameId);
        const commandHistory = CommandHistory.getInstance();
        commandHistory.addCommand(this)
        //game?.commandHistory.addCommand(this);

        const answerValue = keyToAnswerValue(this.key);

        if (answerValue !== null) {
            this.store.gameLogic.recordUserAnswer(this.gameId, this.userId, answerValue);
        } else {
            console.log(`Invalid key pressed: ${this.key}`);
        }        
    }

    undo(): void {
        
    }
}
