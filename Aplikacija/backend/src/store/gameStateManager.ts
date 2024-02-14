
import { Server as SocketIOServer } from 'socket.io';
import ICommand from '../commands/ICommand';
import Store from '../store/store';
import Question, { IQuestion } from '../models/questionModel';
import { GameData, prepareGameData } from '../models/gameModel/gameData';
import IQuestionToQuestionDto from "../utils/convertor"
import {getHostMessage} from '../controllers/hostController'
import { HostMessageParams } from '../models/hostModel';

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
        //const initialGameState=Store.getInitialState(roomId);
    
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
            this.showHostMessage(roomId);
        }, 5000); 
    }

    async showHostMessage(roomId:string){
        const params=this.gameParamsFiller(roomId)

        if(!params)
        return;

        const message=await getHostMessage(params);

        this.io.to(roomId).emit('hostMessage', message);
        setTimeout(() => {
            this.sendQuestion(roomId);
        }, 5000); 
    }

    gameParamsFiller(roomId: string): HostMessageParams | undefined {
        const game = Store.getGame(roomId);
    
        if (!game) {
            console.error('Game not found');
            return undefined;
        }
    
        const playerStates = Array.from(game.players.values());
    
        const correctAnswers = playerStates.map(state => state.isCorrect);
        const wrongAnswers = playerStates.map(state => !state.isCorrect);
        const playerNames = playerStates.map(state => state.username);
    
        const playerPositions = playerStates
            .map((state, index) => ({ index: index + 1, score: state.score }))
            .sort((a, b) => b.score - a.score)
            .map(player => player.index);
    
        return {
            correctAnswers,
            wrongAnswers,
            playerPositions,
            playerNames
        };
    }

}

export default GameStateManager;


