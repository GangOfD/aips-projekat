import mongoose from "mongoose";
import Question, { IQuestion } from "../questionModel";
import { GameRepo } from "../../repository/gameRepository";
import { UserState } from "../IUserState"
import Game from "./gameModel";
import Player from "../playerModel";
import { GameState } from "../gameStates";
import { CommandHistory } from "../../commands/CommandHistory";

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
    state:GameState;
    commandHistory:CommandHistory;

    constructor(questions: IQuestion[], playersData: Map<string, UserState>) {
        this.players = playersData;
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.responses = new Map();
        this.state=GameState.Waiting;
        this.commandHistory=new CommandHistory();
    }

    recordResponse(questionId: string, response: UserResponse) {
        if (!this.responses.has(questionId)) {
            this.responses.set(questionId, []);
        }
        this.responses.get(questionId)?.push(response);
    }
    
}
//CHECK THIS !! 
export async function prepareGameData(roomId: string): Promise<GameData | null> {
    try {
        const gameDataFromDB = await Game.findOne({ gameId: roomId }).populate('questions');

        if (!gameDataFromDB) return null;

        if (!gameDataFromDB.questions || !Array.isArray(gameDataFromDB.questions)) {
            throw new Error('Questions could not be populated');
        }

        const questions: IQuestion[] = gameDataFromDB.questions as unknown as IQuestion[];
        const playersData = new Map<string, UserState>();

        for (const playerId of gameDataFromDB.players) {
            const playerDoc = await Player.findById(playerId);
            const username = playerDoc ? playerDoc.username : "Unknown";

            const userState: UserState = {
                score: 0,
                currentAnswer: null,
                answerTime: null,
                hasAnswered: false,
                isCorrect: false,
                username: username
            };

            playersData.set(playerId.toString(), userState);
        }

        return new GameData(questions, playersData);
    } catch (error) {
        console.error('Error preparing game data:', error);
        return null;
    }
}