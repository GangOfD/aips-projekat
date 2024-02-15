export interface resultState {
    gameId: string;
    questionsAsked: number;
    scoreBoard: {
        username: string,
        points: number
    }[]
}