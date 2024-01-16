"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = __importDefault(require("../store/store"));
const authenticate_1 = require("../middleware/authenticate");
class AnswerCommand {
    constructor(token, answerValue, gameId) {
        this.userId = (0, authenticate_1.verifyToken)(token);
        this.answerValue = answerValue;
        this.gameId = gameId;
    }
    execute() {
        if (this.userId === null) {
            throw new Error('Invalid token');
        }
        store_1.default.recordUserAnswer(this.gameId, this.userId, this.answerValue);
    }
    checkAnswerCorrectness(questionId, answerValue) {
        // Implement the logic to check if the answer is correct
        // This might involve fetching the question details and comparing the answer
        return true; // Placeholder return value
    }
}
exports.default = AnswerCommand;
