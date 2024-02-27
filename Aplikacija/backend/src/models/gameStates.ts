
export enum GameState {
    Waiting = 'waiting',
    InProgress = 'inProgress',
    Finished = 'finished',
}

export enum InProgressSubState {
    ShowingTable = 'showingTable',
    ShowingQuestionAndAnswering = 'showingQuestionAndAnswering',
    ShowingHostMessage = 'showingHostMessage',
}

export type GameStatus =
    | { state: GameState.Waiting }
    | { state: GameState.InProgress, subState: InProgressSubState }
    | { state: GameState.Finished };
