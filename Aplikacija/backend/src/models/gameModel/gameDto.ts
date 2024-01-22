export interface gameDto {
    gameId: string; 
    createdBy: string;
    players: string[];
    status: 'waiting' | 'inProgress' | 'completed';
    createdAt: Date | null;
}