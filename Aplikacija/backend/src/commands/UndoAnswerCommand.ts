
import ICommand from './ICommand';
import Store from '../managers/store';

export default class UndoAnswerCommand implements ICommand {
    constructor(private userId: string) {}

    execute(): void {
        // Store.updateUserState(this.userId, { currentAnswer: null });
    }
}
