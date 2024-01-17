
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
            this.showResults(roomId);
            return;
        }

        const question = Store.getNextQuestion(roomId);
        if (question) {
            const questionDto=IQuestionToQuestionDto(question);

            this.io.emit('newQuestion', questionDto);

            this.questionTimer = setTimeout(() => {
                Store.updateScoresAfterQuestion(roomId)
                this.showResults(roomId);
            }, 10000);
        } else {
            // this.showFinalTable(roomId);
        }
    }

    showResults(roomId:string) {
       const results = Store.getScoreboardTable(roomId);
       this.io.emit('questionResults', results);

        setTimeout(() => {
            this.sendQuestion(roomId);
        }, 5000);
    }


}

export default GameStateManager;


