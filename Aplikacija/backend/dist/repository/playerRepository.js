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
exports.PlayerRepository = void 0;
class PlayerRepository {
    constructor(playerModel) {
        this.playerModel = playerModel;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const players = yield this.playerModel.find();
                return players;
            }
            catch (error) {
                throw new Error(`Error while fetching players: ${error.message}`);
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const player = yield this.playerModel.findById(id);
                return player;
            }
            catch (error) {
                throw new Error(`Error while fetching player by ID: ${error.message}`);
            }
        });
    }
    create(player) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdPlayer = yield this.playerModel.create(player);
                return createdPlayer;
            }
            catch (error) {
                throw new Error(`Error while creating player: ${error.message}`);
            }
        });
    }
    update(id, playerData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedPlayer = yield this.playerModel.findByIdAndUpdate(id, playerData, { new: true });
                return updatedPlayer;
            }
            catch (error) {
                throw new Error(`Error while updating player: ${error.message}`);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.playerModel.findByIdAndDelete(id);
            }
            catch (error) {
                throw new Error(`Error while deleting player: ${error.message}`);
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const player = yield this.playerModel.findOne({ email });
                return player;
            }
            catch (error) {
                throw new Error(`Error while fetching player by email: ${error.message}`);
            }
        });
    }
}
exports.PlayerRepository = PlayerRepository;
