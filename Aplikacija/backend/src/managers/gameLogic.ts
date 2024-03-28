import { Store } from './store';
import { HostMessageParams } from '../models/hostModel';
import {ENV} from '../enviroments/constants'
import { GameState,GameStatus } from '../models/gameStates';
require('dotenv').config();


export class GameLogic {
    private store: Store;

    constructor(store: Store) {
        this.store = store;
    }

    public isGameOver(roomId: string): boolean {
        const gameData = this.store.getGame(roomId);
        if (!gameData) {
            console.error('Game not found for roomId:', roomId);
            return true;
        }
        return gameData.currentQuestionIndex >= gameData.questions.length;
    }

    public updateScoresAfterQuestion(roomId: string): void {
        const gameData = this.store.getGame(roomId);
        if (!gameData) {
            console.error('Game not found for roomId:', roomId);
            return;
        }

        this.assignPoints(roomId)
    }

    public recordUserAnswer(roomId: string, userId: string, currentAnswer: number | null) {
        const game = this.store.getGame(roomId);
        if (!game) {
            throw new Error('Game not found -recordUserAnswer')
            // return;
        }

        if(!this.isAnswerableMode(roomId)){
            console.log("Cannot save an answer")
            return;
        }

        const userState = game.players.get(userId);
        if (!userState) {
            console.log(`User ${userId} not found in game ${roomId}.`);
            throw new Error('userState not found -recordUserAnswer')
            // return; 
        }

        //Check whether game is in answerable mode

        userState.currentAnswer = currentAnswer;
        userState.hasAnswered= true;
        userState.answerTime = Date.now()
    }

    public undoUserAnswer(roomId: string, userId: string) {
        const game = this.store.getGame(roomId);
        if (!game) {
            throw new Error('Game not found -recordUserAnswer')
            // return;
        }

        if(!this.isAnswerableMode(roomId)){
            console.log("Cannot save an answer")
            return;
        }

        const userState = game.players.get(userId);
        if (!userState) {
            console.log(`User ${userId} not found in game ${roomId}.`);
            throw new Error('userState not found -recordUserAnswer')
            // return; 
        }


        userState.currentAnswer = null;
        userState.hasAnswered= false;
        userState.answerTime = Date.now()
    }


      gameParamsFiller(roomId: string): HostMessageParams | undefined {
        const game = this.store.getGame(roomId);
    
        if (!game) {
            console.error('Game not found');
            return undefined;
        }
    
        const playerStates = Array.from(game.players.values());
    
        const correctAnswers = playerStates.map(state => state.isCorrect);
        const hasAnswered = playerStates.map(state => state.hasAnswered);
        const playerNames = playerStates.map(state => state.username);
    
        const playerPositions = playerStates
            .map((state, index) => ({ index: index + 1, score: state.score }))
            .sort((a, b) => b.score - a.score)
            .map(player => player.index);
            this.resetUserStateAnswers(roomId);
    
        return {
            correctAnswers,
            hasAnswered,
            playerPositions,
            playerNames
        };
    }

     public assignPoints(gameId: string) {
        const gameData = this.store.getGame(gameId);
        if (!gameData) {
            console.error("Game not found");
            return;
        }

        const currentQuestionIndex = gameData.currentQuestionIndex - 1; 

        if (currentQuestionIndex < 0 || currentQuestionIndex >= gameData.questions.length) {
            console.error("Invalid question index. Current question index is: ", currentQuestionIndex," ,while gamedata question length is: ", gameData.questions.length);
            return;
        }

        const currentQuestion = gameData.questions[currentQuestionIndex];
        const correctAnswerIndex = currentQuestion.correctAnswerIndex;

        const sortedCorrectResponses = Array.from(gameData.players.entries())
            .filter(([_, userState]) => userState.currentAnswer === correctAnswerIndex)
            .sort((a, b) => (a[1].answerTime || Number.MAX_VALUE) - (b[1].answerTime || Number.MAX_VALUE));

        gameData.players.forEach((userState, userId) => {
            if (userState.currentAnswer === correctAnswerIndex) {
                let pointsAwarded = ENV.pointsCorrectAnswer; 
                const index = sortedCorrectResponses.findIndex(([id, _]) => id === userId);
                if (index === 0) pointsAwarded = ENV.pointsFirstCorrectAnswer;
                else if (index === 1) pointsAwarded = ENV.pointsSecondCorrectAnswer;
                else if (index === 2) pointsAwarded = ENV.pointsThirdCorrectAnswer;
                else if (index === 3) pointsAwarded = ENV.pointsForthCorrectAnswer;
                userState.score += pointsAwarded;
                userState.isCorrect=true;
                userState.hasAnswered = true;
            } else if (userState.hasAnswered) {
                userState.score += ENV.pointsLostWrongAnswer; 
                userState.isCorrect=false;
                userState.hasAnswered = true;
            }
        });
    }

    public isAnswerableMode(roomId:string):boolean{
        const game=this.store.getGame(roomId);

        if(!game)
        return false;

        if(game.state!==GameState.InProgress)
        return false;

        //Check also for the substates
        return true;
    }

    public resetUserStateAnswers(roomId: string): void {
        const game = this.store.getGame(roomId);
    
        if (!game) {
            console.log("Game not found:", roomId);
            return;
        }
    
        game.players.forEach((userState, userId) => {
            userState.hasAnswered = false;
            userState.currentAnswer = -1; 
            userState.isCorrect = false; 
            userState.answerTime = null;
        });
    
        console.log(`Reset user states for game ${roomId}`);
    }

}
