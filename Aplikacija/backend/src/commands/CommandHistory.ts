import ICommand from "./ICommand";

export class CommandHistory {
    private static instance: CommandHistory;
    private commandQueue: ICommand[] = [];
    private userCommandMap: Map<string, ICommand> = new Map();
    //public roomId:string;

    public static getInstance(): CommandHistory {
        if (!CommandHistory.instance) {
            CommandHistory.instance = new CommandHistory();
        }
        return CommandHistory.instance;
    }

    private constructor() { }


    public addCommand(command: ICommand) {
        this.commandQueue.push(command);
        this.userCommandMap.set(command.userId, command);
    }

    public getCommand(userId: string): ICommand | undefined {
        const command = this.userCommandMap.get(userId)
        return command;
    }

    public deleteCommand(command: ICommand) {
        const userId = command.userId;

        this.userCommandMap.delete(userId)
    }


    getLatestCommand(): ICommand | null {
        const command = this.commandQueue.pop();

        if (!command)
            return null;

        return command;
    }

    executeLatestCommand() {
        const command = this.commandQueue.pop();
        if (command) {
            command.execute();
            this.userCommandMap.set(command.userId, command);
        }
    }

    undoUserCommand(userId: string) {
        const command = this.userCommandMap.get(userId);
        if (command) {
            //command.undo();
            this.userCommandMap.delete(userId);
            // Maybe i should delete from the queue also
        }
    }

    clearHistory() {
        this.commandQueue = [];
        this.userCommandMap.clear();
    }
}
