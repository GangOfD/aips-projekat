import { Store } from './store';
import { resultState } from '../models/IResultState';

export class ScoreboardManager {
    private store: Store;

    constructor(store: Store) {
        this.store = store;
    }

    public getScoreboardTable(roomId: string): resultState {
        const gameData = this.store.getGame(roomId);
        if (!gameData) {
            throw new Error('Game not found');
        }

        const results: resultState = {
            gameId: roomId,
            questionsAsked: gameData.currentQuestionIndex,
            scoreBoard: []
        };

        gameData.players.forEach((userState, userId) => {
            const username = userState.username;
            const points = userState.score;

            results.scoreBoard.push({ username, points });
        });

        results.scoreBoard.sort((a, b) => b.points - a.points);

        return results;
    }

}
