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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const questionModel_1 = __importDefault(require("../models/questionModel"));
class GameData {
    constructor(players, questionIds, currentQuestionIndex, responses) {
        this.players = players;
        this.questions = [];
        this.currentQuestionIndex = currentQuestionIndex;
        this.responses = responses;
    }
    populateQuestions(questionIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const questions = yield questionModel_1.default.find({ '_id': { $in: questionIds } });
            this.questions = questions;
        });
    }
    static fromMongoEntity(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const gameData = new GameData(entity.players, entity.questions, entity.currentQuestionIndex, entity.responses);
            yield gameData.populateQuestions(entity.questions);
            return gameData;
        });
    }
}
exports.default = GameData;
