import Question, { IQuestion } from "../models/questionModel";

interface UserResponse {
    answer: string;
    timestamp: number;
}

export default class GameData {
    players: string[];
    questions: IQuestion[];
    currentQuestionIndex: number;
    responses: { [questionId: string]: UserResponse[] };

    constructor(players: string[], questionIds: string[], currentQuestionIndex: number, responses: { [questionId: string]: UserResponse[] }) {
        this.players = players;
        this.questions = [];
        this.currentQuestionIndex = currentQuestionIndex;
        this.responses = responses;
    }

    private async populateQuestions(questionIds: string[]) {
        const questions = await Question.find({ '_id': { $in: questionIds } });
        this.questions = questions;
    }

    static async fromMongoEntity(entity: any): Promise<GameData> {
        const gameData = new GameData(
            entity.players,
            entity.questions, 
            entity.currentQuestionIndex,
            entity.responses
        );

        await gameData.populateQuestions(entity.questions);
        return gameData;
    }
}