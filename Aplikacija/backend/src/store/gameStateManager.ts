
import { Server as SocketIOServer } from 'socket.io';
import ICommand from '../commands/ICommand';
import Store from '../store/store';
import Question, { IQuestion } from '../models/questionModel';
import { resourceLimits } from 'worker_threads';
import { GameData, prepareGameData } from '../models/gameData';
import IQuestionToQuestionDto from "../utils/convertor"

class GameStateManager {
    private io: SocketIOServer;
    private questionTimer: NodeJS.Timeout | null = null;
    // private roomId: string;
    private counter: number = 0;

    constructor(io: SocketIOServer, roomId: string) {
        this.io = io;
        // this.roomId = roomId;
    }

    async startGameCycle(roomId: string) {
        const gameData = await prepareGameData(roomId);

        if (!gameData) {
            console.error("Failed to start game cycle: game data could not be prepared.");
            return;
        }
        Store.addGameData(roomId, gameData);
        this.sendQuestion(roomId);
    }

    sendQuestion(roomId: string) {
        if (Store.isGameOver(roomId)) {
            this.showFinalTable(roomId);
            return;
        }

        const question = Store.getNextQuestion(roomId);
        if (question) {
            const questionDto=IQuestionToQuestionDto(question);

            this.io.emit('newQuestion', questionDto);

            this.questionTimer = setTimeout(() => {
                this.showResults(roomId);
            }, 10000);
        } else {
            this.showFinalTable(roomId);
        }
    }

    showResults(roomId:string) {
        //const results = Store.calculateResultsForQuestion(this.currentQuestion);
       // this.io.emit('questionResults', results);

        // After 5 seconds, send the next question or end game
        setTimeout(() => {
            this.sendQuestion(roomId);
        }, 5000);
    }

    //evaluateUserResponse(roomId, userId,answerNumber){}


    showFinalTable(roomId:string) {
        const finalScores = Store.getFinalScores(roomId);
        this.io.emit('gameOver', finalScores);
        // Store.resetGame();  // Reset the game state for a new game
    }
}

export default GameStateManager;


