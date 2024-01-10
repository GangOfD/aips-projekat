"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRepo = void 0;
class GameRepo {
    constructor(gameModel) {
        this.gameModel = gameModel;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const games = yield this.gameModel.find();
                return games;
            }
            catch (error) {
                throw new Error(`Error while fetching games: ${error.message}`);
            }
        });
    }
    getById(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Querying for roomId:", roomId);
                const game = yield this.gameModel.findOne({ gameId: roomId });
                console.log("Found game:", game);
                return game;
            }
            catch (error) {
                throw new Error(`Error while fetching game by room ID: ${error.message}`);
            }
        });
    }
    create(game) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdGame = yield this.gameModel.create(game);
                return createdGame;
            }
            catch (error) {
                throw new Error(`Error while creating game: ${error.message}`);
            }
        });
    }
    update(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.gameModel.findByIdAndUpdate(id, updateData, { new: true });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.gameModel.findByIdAndDelete(id);
            }
            catch (error) {
                throw new Error(`Error while deleting game: ${error.message}`);
            }
        });
    }
}
exports.GameRepo = GameRepo;
