
import ICommand from './ICommand';
import Store from '../store/store';

export default class UndoAnswerCommand implements ICommand {
    constructor(private userId: string) {}

    execute(): void {
        // Store.updateUserState(this.userId, { currentAnswer: null });
    }
}
