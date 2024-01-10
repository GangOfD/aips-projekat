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
exports.deleteQuestion = exports.updateQuestion = exports.getQuestion = exports.addQuestion = exports.fetchQuestionsForGame = exports.getQuestions = void 0;
const questionRepository_1 = require("../repository/questionRepository");
const questionModel_1 = __importDefault(require("../models/questionModel"));
const questionRepo = new questionRepository_1.QuestionRepository(questionModel_1.default);
const getQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield questionRepo.getAll();
        return res.json(questions);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getQuestions = getQuestions;
const fetchQuestionsForGame = (numberOfQuestions) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield questionRepo.getQuestions(numberOfQuestions);
    }
    catch (error) {
        throw error;
    }
});
exports.fetchQuestionsForGame = fetchQuestionsForGame;
const addQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionText, options, correctAnswerIndex } = req.body;
        // Basic Validation
        if (!questionText || !Array.isArray(options) || (typeof correctAnswerIndex !== 'number')) {
            return res.status(400).json({ message: "Invalid request data" });
        }
        if (options.length !== 2 || !options.every(opt => opt.text && opt.picture)) {
            return res.status(400).json({ message: "Options must contain exactly two items, each with text and picture" });
        }
        if (correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
            return res.status(400).json({ message: "Invalid correct answer index" });
        }
        const newQuestion = new questionModel_1.default({
            questionText,
            options,
            correctAnswerIndex
        });
        yield newQuestion.save();
        res.status(201).json({ message: "Question added successfully", question: newQuestion });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addQuestion = addQuestion;
// Get a single question
const getQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ... logic to get a single question ...
});
exports.getQuestion = getQuestion;
// Update a question
const updateQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ... logic to update a question ...
});
exports.updateQuestion = updateQuestion;
// Delete a question
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ... logic to delete a question ...
});
exports.deleteQuestion = deleteQuestion;
