import mongoose from "mongoose";
import Question, { IQuestion } from "../models/questionModel";
import { GameRepo } from "../repository/gameRepository";
import { UserState } from "../store/store";
import Game from "./gameModel";

export interface UserResponse {
    userId: string;
    answer: number;
    timeTaken: number;
}

export class GameData {
    players: Map<string, UserState>;
    questions: IQuestion[];
    currentQuestionIndex: number;
    responses: Map<string, UserResponse[]>; 

    constructor(questions: IQuestion[], playersData: Map<string, UserState>) {
        this.players = playersData;
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.responses = new Map();
    }

    recordResponse(questionId: string, response: UserResponse) {
        if (!this.responses.has(questionId)) {
            this.responses.set(questionId, []);
        }
        this.responses.get(questionId)?.push(response);
    }
    
}

export async function prepareGameData(roomId: string): Promise<GameData | null> {
    try {

        const gameDataFromDB = await Game.findOne({gameId:roomId}).populate('questions');

        if (!gameDataFromDB) return null;

        if (!gameDataFromDB.questions || !Array.isArray(gameDataFromDB.questions)) {
            throw new Error('Questions could not be populated');
        }

        const questions: IQuestion[] = gameDataFromDB.questions as unknown as IQuestion[];
        const playersData = new Map<string, UserState>();

        gameDataFromDB.players.forEach(playerId => {
            const userState: UserState = {
                score: 0,
                currentAnswer: null,
                answerTime: null,
                hasAnswered: false,
                isCorrect: false
            };
            playersData.set(playerId.toString(), userState);
        });

        return new GameData(questions, playersData);
    } catch (error) {
        console.error('Error preparing game data:', error);
        return null;
    }
}