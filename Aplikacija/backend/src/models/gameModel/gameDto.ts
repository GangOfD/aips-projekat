import { GameState } from "../gameStates";

export interface gameDto {
    gameId: string; 
    createdBy: string;
    players: string[];
    status: GameState;
    createdAt: Date | null;
}