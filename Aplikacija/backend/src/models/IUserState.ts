export interface UserState {
    score: number;
    currentAnswer: number | null;
    answerTime: number | null;
    hasAnswered: boolean;
    isCorrect: boolean;
    username: string;
}