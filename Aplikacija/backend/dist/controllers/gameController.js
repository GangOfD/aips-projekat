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
exports.getAllAvailableGames = exports.getAllGames = exports.createGame = exports.deleteGame = exports.joinGame = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const questionController_1 = require("./questionController");
const gameModel_1 = __importDefault(require("../models/gameModel"));
const gameRepository_1 = require("../repository/gameRepository");
const store_1 = __importDefault(require("../store/store"));
const gameStateManager_1 = __importDefault(require("../store/gameStateManager"));
const playerModel_1 = __importDefault(require("../models/playerModel"));
const gameRepo = new gameRepository_1.GameRepo(gameModel_1.default);
// export const joinGame = async (req: RequestWithUserId, res: Response) => {
//   try {
//     const { roomId } = req.body;
//     const userId = req.userId;
//     const game = await gameRepo.getById(roomId);
//     if (!game) {
//       return res.status(404).json({ message: 'Game not found' });
//     }
//     const userIdObj = new mongoose.Types.ObjectId(userId);
//     if (game.players.length >= 3 || game.players.includes(userIdObj)) {
//       return res.status(400).json({ message: 'You have already joined this game' });
//     }
//     if (userId) {
//       const updatedGame = await gameRepo.update(game._id, { 
//         players: [...game.players, userIdObj] 
//       });
//       console.log("Joined")
//       res.json({ message: 'Joined the game successfully', game: updatedGame });
//     } else {
//       res.status(400).json({ message: 'User ID is required' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
const joinGame = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { roomId, userId } = data;
        const game = yield gameRepo.getById(roomId);
        if (!game) {
            socket.emit('joinError', 'Game not found');
            return;
        }
        const userIdObj = new mongoose_1.default.Types.ObjectId(userId);
        if (game.players.includes(userIdObj)) {
            socket.emit('joinError', 'You have already joined this game');
            return;
        }
        if (game.players.length == 4) {
            socket.emit('joinError', 'Game is already full');
            return;
        }
        const updatedGame = yield gameRepo.update(game._id, {
            players: [...game.players, userIdObj]
        });
        const playerIds = game.players;
        const players = yield playerModel_1.default.find({ _id: { $in: playerIds } });
        const playerNames = players.map(player => player.username);
        let DTO = {
            createdAt: game.createdAt,
            players: playerNames,
            status: game.status,
            gameId: game.gameId,
            createdBy: (_b = (_a = (yield playerModel_1.default.findById(game.createdBy))) === null || _a === void 0 ? void 0 : _a.username) !== null && _b !== void 0 ? _b : "Unknown"
        };
        if ((updatedGame === null || updatedGame === void 0 ? void 0 : updatedGame.players.length) == 4) {
            store_1.default.setGame(roomId, updatedGame);
            console.log("Socket is emitting");
            socket.emit('gameStarted', DTO);
            socket.broadcast.emit('gameStarted', updatedGame);
            gameStateManager_1.default.startGameCycle(roomId);
        }
        else {
            socket.emit('gameJoined', { DTO });
            socket.broadcast.emit('playerJoined', { DTO });
        }
    }
    catch (error) {
        console.error('Error in joinGame:', error);
        socket.emit('joinError', 'Error joining game');
    }
});
exports.joinGame = joinGame;
const deleteGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.body;
        const userId = req.userId;
        // const game = await Game.findOne({gameId:roomId});
        const game = yield gameRepo.getById(roomId);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        if (game.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this game' });
        }
        // await Game.findByIdAndDelete(game._id);
        yield gameRepo.delete(game._id);
        res.json({ message: 'Game deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteGame = deleteGame;
const createGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.body;
        const userId = req.userId;
        console.log(roomId, typeof roomId);
        const existingGame = yield gameRepo.getById(roomId);
        if (existingGame) {
            return res.status(403).json({ message: 'Game with this ID already exists' });
        }
        const numberOfQuestions = parseInt(process.env.numberOfQuestions || '5', 10);
        if (isNaN(numberOfQuestions) || numberOfQuestions <= 0) {
            return res.status(400).json({ message: 'Invalid number of questions' });
        }
        const questions = yield (0, questionController_1.fetchQuestionsForGame)(numberOfQuestions);
        const newGame = {
            gameId: roomId,
            createdBy: new mongoose_1.default.Types.ObjectId(userId),
            players: [],
            questions: questions.map(q => q._id),
            status: 'waiting',
            createdAt: new Date()
        };
        const createdGame = yield gameRepo.create(newGame);
        res.json({ message: 'Game created successfully', game: createdGame });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createGame = createGame;
const getAllGames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const games = yield gameModel_1.default.find({ players: new mongoose_1.default.Types.ObjectId(userId) });
        res.json({ games });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllGames = getAllGames;
const getAllAvailableGames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const userId = req.userId;
        const availableGames = yield gameModel_1.default.find({
            status: 'waiting',
            //  players: { $not: { $in: [new mongoose.Types.ObjectId(userId)] } },
        });
        res.json({ availableGames });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllAvailableGames = getAllAvailableGames;
