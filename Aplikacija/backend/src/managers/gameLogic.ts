import { Store } from './store';
import { GameData } from '../models/gameModel/gameData';
import { UserState } from '../models/IUserState';
import { HostMessageParams } from '../models/hostModel';

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

        const correctAnswerIndex = this.getCorrectAnswerIndex(gameData);
        this.assignPointsToPlayers(gameData, correctAnswerIndex);
    }

    public getCorrectAnswerIndex(gameData: GameData): number {
        let qNumber = gameData.currentQuestionIndex;

        if (qNumber <= 0 || qNumber > gameData.questions.length) {
            console.error(`Invalid question number: ${qNumber}`);
            return -1;
        }

        return gameData.questions[qNumber - 1].correctAnswerIndex;
    }

    public assignPointsToPlayers(gameData: GameData, correctAnswerIndex: number): void {
        const correctResponses = this.getCorrectResponses(gameData, correctAnswerIndex);
        this.assignPointsForCorrectAnswers(correctResponses);

        this.assignPointsForIncorrectAndNoAnswers(gameData, correctAnswerIndex);
    }
    public getCorrectResponses(gameData: GameData, correctAnswerIndex: number): [string, UserState][] {
        return Array.from(gameData.players)
            .filter(([_, userState]) => userState.currentAnswer === correctAnswerIndex)
            .sort((a, b) => (a[1].answerTime ?? Number.MAX_VALUE) - (b[1].answerTime ?? Number.MAX_VALUE));
    }

    public assignPointsForCorrectAnswers(correctResponses: [string, UserState][]): void {
        const pointsForCorrect = [4, 3, 2, 1];
        correctResponses.forEach(([userId, userState], index) => {
            userState.score += pointsForCorrect[index] ?? 1;
        });
    }

    public assignPointsForIncorrectAndNoAnswers(gameData: GameData, correctAnswerIndex: number): void {
        gameData.players.forEach((userState) => {
            if (userState.currentAnswer !== correctAnswerIndex && userState.currentAnswer !== null) {
                userState.score -= 1;
            }
        });
    }

    public recordUserAnswer(roomId: string, userId: string, currentAnswer: number | null) {
        const game = this.store.getGame(roomId);
        if (!game) {
            throw new Error('Game not found -recordUserAnswer')
            // return;
        }

        // if(game.gamePhase!==ShowingQuestion)
        //   {
        //     console.log("You can not answer now since question time is over")
        //   }

        const userState = game.players.get(userId);
        if (!userState) {
            console.log(`User ${userId} not found in game ${roomId}.`);
            throw new Error('userState not found -recordUserAnswer')
            // return; 
        }
        userState.currentAnswer = currentAnswer;
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
