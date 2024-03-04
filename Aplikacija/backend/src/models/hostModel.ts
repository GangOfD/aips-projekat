export interface HostMessageParams {
    correctAnswers: boolean[]; 
    hasAnswered: boolean[];
    playerPositions: number[]; 
    playerNames:string[] | undefined;
}
