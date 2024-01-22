
import { Server as SocketIOServer } from 'socket.io';
import ICommand from '../commands/ICommand';
import Store from '../store/store';
import Question, { IQuestion } from '../models/questionModel';
import { resourceLimits } from 'worker_threads';
import { GameData, prepareGameData } from '../models/gameModel/gameData';
import IQuestionToQuestionDto from "../utils/convertor"

class GameStateManager {
    private io: SocketIOServer;
    private questionTimer: NodeJS.Timeout | null = null;
    private counter: number = 0;

    constructor(io: SocketIOServer, roomId: string) {
        this.io = io;
    }

    async startGameCycle(roomId: string) {
        const gameData = await prepareGameData(roomId);
    
        if (!gameData) {
            console.error("Failed to start game cycle: game data could not be prepared.");
            return;
        }
        Store.addGameData(roomId, gameData);
    
        setTimeout(() => {
            this.sendQuestion(roomId);
        }, 5000); 
    }
    
    sendQuestion(roomId: string) {
        if (this.questionTimer) {
            clearTimeout(this.questionTimer);
            this.questionTimer = null;
        }

        if (Store.isGameOver(roomId)) {
            this.io.to(roomId).emit('gameOver');
            return;
        }

        const question = Store.getNextQuestion(roomId);
        if (question) {
            const questionDto = IQuestionToQuestionDto(question);
            this.io.to(roomId).emit('newQuestion', questionDto);

            this.questionTimer = setTimeout(() => {
                Store.updateScoresAfterQuestion(roomId);
                this.showResults(roomId);
            }, 10000); 
        } else {
            // this.showFinalTable(roomId); 
        }
    }

    showResults(roomId: string) {
        const results = Store.getScoreboardTable(roomId);
        this.io.to(roomId).emit('questionResults', results);

        setTimeout(() => {
            this.sendQuestion(roomId);
        }, 5000); 
    }


}

export default GameStateManager;


