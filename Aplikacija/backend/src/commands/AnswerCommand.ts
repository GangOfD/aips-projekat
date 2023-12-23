
import ICommand from './ICommand';
import Store from '../store/store';

export default class AnswerCommand implements ICommand {
    constructor(private userId: string, private answer: string) {}

    execute(): void {
        Store.updateUserState(this.userId, { currentAnswer: this.answer });
    }
}
