
import { Server as SocketIOServer } from 'socket.io';
import ICommand from '../commands/ICommand';
import Store from '../store/store';
import Question from '../models/questionModel';
import { resourceLimits } from 'worker_threads';

class GameStateManager {
    private io: SocketIOServer;
    private currentQuestion: any;
    private questionTimer: NodeJS.Timeout | null = null;
    private roomId: string;
    private counter: number = 0;

    constructor(io: SocketIOServer, roomId: string) {
        this.io = io;
        this.roomId = roomId;
    }

    async startGameCycle(roomId:string) {
        await Store.initStore(roomId);
        console.log("Game started, hello from GameStateManager");
        this.sendQuestion();
    }

    sendQuestion() {
        if (Store.isGameOver(this.roomId)) {
            this.showFinalTable();
            return;
        }

        const question = Store.getNextQuestion(this.roomId);
        if (question) {
            this.currentQuestion = question;
            const { correctAnswerIndex, ...questionWithoutAnswer } = question;

            this.io.emit('newQuestion', questionWithoutAnswer);

            this.questionTimer = setTimeout(() => {
                this.showResults();
            }, 10000);
        } else {
            this.showFinalTable(); 
        }
    }

    showResults() {
        const results = Store.calculateResultsForQuestion(this.currentQuestion);
        this.io.emit('questionResults', results);

        // After 5 seconds, send the next question or end game
        setTimeout(() => {
            this.sendQuestion();
        }, 5000);
    }

    //evaluateUserResponse(roomId, userId,answerNumber){}


    showFinalTable() {
        const finalScores = Store.getFinalScores(this.roomId);
        this.io.emit('gameOver', finalScores);
        // Store.resetGame();  // Reset the game state for a new game
    }    
}

export default GameStateManager;


