export interface HostMessageParams {
    correctAnswers: boolean[]; 
    wrongAnswers: boolean[];
    playerPositions: number[]; 
    playerNames:string[] | undefined;
}
