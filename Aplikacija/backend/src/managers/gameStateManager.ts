
import { Server as SocketIOServer } from 'socket.io';
import ICommand from '../commands/ICommand';
import { Store } from '../managers/store';
import Question, { IQuestion } from '../models/questionModel';
import { GameData, prepareGameData } from '../models/gameModel/gameData';
import IQuestionToQuestionDto from "../utils/convertor"
import { getHostMessage } from '../controllers/hostController'
import { HostMessageParams } from '../models/hostModel';
import {ENV} from '../enviroments/constants'

class GameStateManager {
    private io: SocketIOServer;
    private questionTimer: NodeJS.Timeout | null = null;
    private store: Store;

    constructor(io: SocketIOServer, roomId: string, store: Store) {
        this.io = io;
        this.store = store;
    }

    async startGameCycle(roomId: string) {
        const gameData = await prepareGameData(roomId);

        if (!gameData) {
            console.error("Failed to start game cycle: game data could not be prepared.");
            return;
        }
        this.store.gameDataManagment.addGameData(roomId, gameData);
        //const initialGameState=Store.getInitialState(roomId);

        setTimeout(() => {
            this.sendQuestion(roomId);
        }, ENV.beforeGameIntervalMs);
    }

    sendQuestion(roomId: string) {
        if (this.questionTimer) {
            clearTimeout(this.questionTimer);
            this.questionTimer = null;
        }

        if (this.store.gameLogic.isGameOver(roomId)) {
            this.io.to(roomId).emit('gameOver');
            return;
        }

        const question = this.store.gameDataManagment.getNextQuestion(roomId);
        if (question) {
            const questionDto = IQuestionToQuestionDto(question);
            this.io.to(roomId).emit('newQuestion', questionDto);

            this.questionTimer = setTimeout(() => {
                this.store.gameLogic.updateScoresAfterQuestion(roomId);
                this.showResults(roomId);
            }, ENV.questionIntervalMs);
        } else {
            // this.showFinalTable(roomId); 
        }
    }

    showResults(roomId: string) {
        const results = this.store.scoreboardManager.getScoreboardTable(roomId);
        this.io.to(roomId).emit('questionResults', results);

        setTimeout(() => {
            this.showHostMessage(roomId);
        }, ENV.ScoreBoardIntervalMs);
    }

    async showHostMessage(roomId: string) {
        const params = this.store.gameLogic.gameParamsFiller(roomId)

        if (!params)
            return;

        const message = await getHostMessage(params);

        this.io.to(roomId).emit('hostMessage', message);
        setTimeout(() => {
            this.sendQuestion(roomId);
        }, ENV.hostMessageIntervalMs);
    }

    private clearTimer() {
        if (this.questionTimer) {
            clearTimeout(this.questionTimer);
            this.questionTimer = null;
        }
    }

    private scheduleNextEvent(action: () => void, delay: number) {
        this.questionTimer = setTimeout(action, delay);
    }

}

export default GameStateManager;
