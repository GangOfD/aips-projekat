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
const gameModel_1 = __importDefault(require("../models/gameModel"));
const playerModel_1 = __importDefault(require("../models/playerModel"));
const questionModel_1 = __importDefault(require("../models/questionModel"));
const createGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { createdBy } = req.body;
        const creator = yield playerModel_1.default.findById(createdBy);
        if (!creator) {
            return res.status(404).json({ message: 'Player not found' });
        }
        const questionDocs = yield questionModel_1.default.aggregate([{ $sample: { size: 5 } }]);
        const questions = questionDocs.map(doc => ({
            question: doc._id,
            responses: []
        }));
        const newGame = new gameModel_1.default({ createdBy, questions, status: 'waiting' });
        yield newGame.save();
        res.status(201).json(newGame);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const getAllGames = (res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creator = yield gameModel_1.default.find();
        if (!creator) {
            return res.status(404).json({ message: 'Games not found' });
        }
        //paginacija
        res.status(201).json(creator);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = {
    createGame,
    getAllGames
};
