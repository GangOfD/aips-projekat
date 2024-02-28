import ICommand from "./ICommand";

export class CommandHistory {
    private commandQueue: ICommand[] = [];
    private userCommandMap: Map<string, ICommand> = new Map();
    //public roomId:string;

    public addCommand(command: ICommand) {
        this.commandQueue.push(command); // Add command to the queue for execution order
        this.userCommandMap.set(command.userId, command); // Map user to their latest command for undo
    }

    getLatestCommand():ICommand|null {
        const command = this.commandQueue.pop();

        if(!command)
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
            command.undo();
            this.userCommandMap.delete(userId);
            // Maybe i should delete from queue also
        }
    }

    clearHistory() {
        this.commandQueue = [];
        this.userCommandMap.clear();
    }
}
