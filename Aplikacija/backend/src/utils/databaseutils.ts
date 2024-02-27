
import { GameStatus } from '../models/gameStates';
import Game from '../models/gameModel/gameModel';

// Update game status in the database
export async function updateGameStatusInDB(gameId: string, status: GameStatus): Promise<void> {
    await Game.findByIdAndUpdate(gameId, { status });
}
