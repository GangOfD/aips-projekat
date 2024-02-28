import Game, { IGame } from '../models/gameModel/gameModel';
import { IQuestion } from '../models/questionModel'
import { GameData, UserResponse } from '../models/gameModel/gameData';
import { HostMessageParams } from '../models/hostModel';
import {UserState} from '../models/IUserState'
import {resultState} from '../models/IResultState'
import { GameDataManagement } from './gameDataManagment'
import {UserStateManagement} from './userStateManagment'
import {GameLogic} from './gameLogic'
import { ScoreboardManager } from './ScoreboardManager'; 
import { GameRepo } from '../repository/gameRepository';
import { Model } from 'mongoose';



export class Store {
    private static instance: Store;
    public userStates: Map<string, UserState>;
    private games: Map<string, GameData>;
    public userStateManagement: UserStateManagement;
    public gameLogic: GameLogic;
    public scoreboardManager: ScoreboardManager;
    public gameDataManagment: GameDataManagement;


    constructor() {
        this.userStates = new Map();
        this.games = new Map();
        this.userStateManagement = new UserStateManagement(this);
        this.gameLogic = new GameLogic(this);
        this.scoreboardManager = new ScoreboardManager(this);
        this.gameDataManagment = new GameDataManagement(this);
    }

    public getGame(roomId: string): GameData | null {
        return this.games.get(roomId) || null;
    }

    public addGame(roomId: string, gameData: GameData): void {
        if (this.games.has(roomId)) {
            console.log(this.games.get(roomId))
            throw new Error(`Game with ID ${roomId} already exists.`);
        }
        this.games.set(roomId, gameData);
    }

    public deleteGame(roomId: string): void {
        if (!this.games.has(roomId)) {
            throw new Error(`Game with ID ${roomId} does not exist.`);
        }
        const a=this.games.delete(roomId);
        console.log("Delete game, ",a)
    }
    

    public getUserState(userId: string): UserState | undefined {
        return this.userStates.get(userId);
    }

    public setUserState(userId: string, userState: UserState): void {
        this.userStates.set(userId, userState);
    }

    public printStore(): void {
        console.log("Current games in the store:");
        this.games.forEach((gameData, gameId) => {
            console.log(`Game ID: ${gameId}, Status: ${gameData.state}`);
        });

        if(this.games.size === 0) {
            console.log("No games currently in the store.");
        }
    }

    // public setHostParams = (gameId: string): HostMessageParams => {
    //     const gameData = GameDataManagement.getGameData(gameId);
    //     if (!gameData) {
    //         throw new Error('Game data not found');
    //     }
    
    //     const correctAnswers: boolean[] = [];
    //     const wrongAnswers: boolean[] = [];
    //     const playerPositions: number[] = [];
    //     const playerNames:string[]=[];
    
    //     gameData.players.forEach((userState:any, playerId:any) => {
    //         const isCorrect = userState.isCorrect || false;
    //         correctAnswers.push(isCorrect);
    //         wrongAnswers.push(!isCorrect);
    
    //         // Determine the player position based on score
    //         let position = 1;
    //         gameData.players.forEach((otherUserState, otherPlayerId) => {
    //             if (otherPlayerId !== playerId && otherUserState.score > userState.score) {
    //                 position++;
    //             }
    //         });
    //         playerPositions.push(position);
    //     });
    
    //     return {
    //         correctAnswers,
    //         wrongAnswers,
    //         playerPositions,
    //         playerNames

    //     };
    // };
    public static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }

}
// export default new Store();
export default Store.getInstance();

