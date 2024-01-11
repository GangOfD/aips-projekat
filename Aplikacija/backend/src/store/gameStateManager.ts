
import { Server as SocketIOServer } from 'socket.io';
import ICommand from '../commands/ICommand';
import Store from '../store/store';
import Question from '../models/questionModel';
import { resourceLimits } from 'worker_threads';

class GameStateManager {
    private io: SocketIOServer;
    private currentQuestion: any;
    private questionTimer: NodeJS.Timeout | null = null;
    private roomId;

    constructor(io: SocketIOServer,roomId:any) {
        this.io = io;
        this.roomId=roomId
    }

    static startGameCycle (roomId: string ){
        Store.initStore(roomId)
        console.log("game started, hello from gameStateManager")
        while (false){
 
        }
   }

    showQuestion() {
        const question = Store.getNextQuestion(this.roomId);
        if (question) {
            this.currentQuestion = question;
            this.io.emit('newQuestion', question); // Send question to players
    
            this.questionTimer = setTimeout(() => {
                this.showResults();
            }, 10000);  // 10 seconds to answer
        } else {
            this.showFinalTable();  // No more questions, show final results
        }
    }
    //Shows results after 5 seconds
    showResults() {
        const results = Store.calculateResultsForQuestion(this.currentQuestion);
        this.io.emit('questionResults', results);
    
        setTimeout(() => {
            if (Store.isGameOver(this.roomId)) {
                this.showFinalTable();
            } else {
                this.showQuestion();
            }
        }, 5000);  // Show results for 5 seconds before next question or ending game
    }

    //TO DO: listener that checks whether store.ts signals that game is over

    //Shows final table after the game is finished
    showFinalTable() {
        const finalScores = Store.getFinalScores(this.roomId);
        this.io.emit('gameOver', finalScores);
        //Store.resetGame();  // Reset the game state for a new game
    }    
}

export default GameStateManager;
