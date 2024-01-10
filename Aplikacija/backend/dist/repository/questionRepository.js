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
exports.QuestionRepository = void 0;
class QuestionRepository {
    constructor(questionModel) {
        this.questionModel = questionModel;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questions = yield this.questionModel.find();
                return questions;
            }
            catch (error) {
                throw new Error(`Error while fetching questions: ${error.message}`);
            }
        });
    }
    getQuestions(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questions = yield this.questionModel.find().limit(limit);
                return questions;
            }
            catch (error) {
                throw new Error(`Error while fetching questions: ${error.message}`);
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const question = yield this.questionModel.findById(id);
                return question;
            }
            catch (error) {
                throw new Error(`Error while fetching question by ID: ${error.message}`);
            }
        });
    }
    create(question) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdQuestion = yield this.questionModel.create(question);
                return createdQuestion;
            }
            catch (error) {
                throw new Error(`Error while creating question: ${error.message}`);
            }
        });
    }
    update(id, question) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedQuestion = yield this.questionModel.findByIdAndUpdate(id, question, { new: true });
                return updatedQuestion;
            }
            catch (error) {
                throw new Error(`Error while updating question: ${error.message}`);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.questionModel.findByIdAndDelete(id);
            }
            catch (error) {
                throw new Error(`Error while deleting question: ${error.message}`);
            }
        });
    }
}
exports.QuestionRepository = QuestionRepository;
