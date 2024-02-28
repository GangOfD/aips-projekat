
import { Server as SocketIOServer } from 'socket.io';
import ICommand from '../commands/ICommand';
import { Store } from '../managers/store';
import { GameData, prepareGameData } from '../models/gameModel/gameData';
import IQuestionToQuestionDto from "../utils/convertor"
import { getHostMessage } from '../controllers/hostController'
import {ENV} from '../enviroments/constants'
import Game from '../models/gameModel/gameModel'
import { GameRepo } from '../repository/gameRepository';
import { GameState } from '../models/gameStates';

class GameStateManager {
    private io: SocketIOServer;
    private questionTimer: NodeJS.Timeout | null = null;
    private store: Store;
    private gameRepo:GameRepo;

    constructor(io: SocketIOServer, roomId: string, store: Store) {
        this.io = io;
        this.store = store;
        this.gameRepo=new GameRepo(Game)
    }

    async startGameCycle(roomId: string) {
        const gameData = await prepareGameData(roomId);

        if (!gameData) {
            console.error("Failed to start game cycle: game data could not be prepared.");
            return;
        }
        gameData.state=GameState.InProgress;
        
        this.store.gameDataManagment.addGameData(roomId, gameData);
        this.store.printStore();

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
            this.gameComplete(roomId);
            //this.io.to(roomId).emit('gameOver');
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

    async gameComplete(roomId: string): Promise<void> {
        const game = this.store.getGame(roomId);
        if (!game) {
            console.log("Game not found:", roomId);
            return;
        }
    
        try {
            const thisGame = await this.gameRepo.getById(roomId);
            if (!thisGame) {
                console.log("Game not found in database:", game);
                return;
            }
    
            thisGame.status = GameState.Finished;
            await thisGame.save();
    
            const scoreboardTable = this.store.scoreboardManager.getScoreboardTable(roomId);
    
            this.io.to(roomId).emit('gameOver', scoreboardTable);
        } catch (error) {
            console.error("Error completing game:", error);
        }
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
