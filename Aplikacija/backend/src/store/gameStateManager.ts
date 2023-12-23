// src/game/GameStateManager.ts

import { Server as SocketIOServer } from 'socket.io';
import ICommand from '../commands/ICommand';
import Store from '../store/store';

class GameStateManager {
    private io: SocketIOServer;
    private currentQuestion: string;
    private questionTimer: NodeJS.Timeout | null = null;

    constructor(io: SocketIOServer) {
        this.io = io;
    }

    startNewQuestion(question: string): void {
        this.currentQuestion = question;
        Store.resetCurrentQuestionState();

        this.questionTimer = setTimeout(() => {
            this.endQuestion();
        }, 10000); 
    }

    endQuestion(): void {
        const results = Store.calculateResults();
        Store.saveResultsToDatabase();

        this.io.emit('questionEnded', results);

        if (this.isGameOver()) {
            //pokupi informacije 
            this.io.emit('gameOver', {/* posalji prikupljene informacije */});
        } else {
        }
    }

    executeCommand(command: ICommand): void {
        command.execute();
    }

    private isGameOver(): boolean {
        return false;
    }
}

export default GameStateManager;
