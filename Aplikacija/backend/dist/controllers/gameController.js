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
exports.getAllAvailableGames = exports.getAllGames = exports.createGame = exports.deleteGame = exports.joinGame = exports.leaveGame = exports.startGame = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const questionController_1 = require("./questionController");
const gameModel_1 = __importDefault(require("../models/gameModel"));
const gameRepository_1 = require("../repository/gameRepository");
const app_1 = require("../app");
const gameStateManager_1 = __importDefault(require("../store/gameStateManager"));
const playerModel_1 = __importDefault(require("../models/playerModel"));
const playerRepository_1 = require("../repository/playerRepository");
const authenticate_1 = require("../middleware/authenticate");
const gameRepo = new gameRepository_1.GameRepo(gameModel_1.default);
const playerRepo = new playerRepository_1.PlayerRepository(playerModel_1.default);
const startGame = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const game = yield gameRepo.getById(data.roomId);
        const player = yield playerRepo.getById(data.userId);
        if (!(game && player))
            return;
        if (((_a = game.players) === null || _a === void 0 ? void 0 : _a.length) !== 4)
            return;
        if (game.status != "waiting")
            return;
        game.status = "inProgress";
        yield game.save();
        const playerIds = game.players;
        const players = yield playerModel_1.default.find({ _id: { $in: playerIds } });
        const playerNames = players.map(player => player.username);
        let DTO = {
            createdAt: game.createdAt,
            players: playerNames,
            status: game.status,
            gameId: game.gameId,
            createdBy: (_c = (_b = (yield playerModel_1.default.findById(game.createdBy))) === null || _b === void 0 ? void 0 : _b.username) !== null && _c !== void 0 ? _c : "Unknown"
        };
        app_1.io.to(data.roomId).emit('gameStarted', DTO);
        const gameStateManager = new gameStateManager_1.default(app_1.io, data.roomId);
        yield gameStateManager.startGameCycle(data.roomId);
    }
    catch (error) {
        console.error('Error in startGame:', error);
        socket.emit('startError', 'Error starting the game');
    }
});
exports.startGame = startGame;
const leaveGame = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = data.roomId;
        const userId = (0, authenticate_1.verifyToken)(data.token);
        if (!userId) {
            socket.emit('leaveGameError', 'Invalid or expired token');
            return;
        }
        const game = yield gameRepo.getById(gameId);
        if (!game) {
            socket.emit('leaveGameError', 'Game not found');
            return;
        }
        if (!game.players.includes(new mongoose_1.default.Types.ObjectId(userId))) {
            socket.emit('leaveGameError', 'Cannot exit game, user is not in that game');
            return;
        }
        const updatedGame = yield gameRepo.removePlayerFromGame(gameId, userId);
        app_1.io.to(data.roomId).emit('gameLeft', { roomId: gameId, userId: userId });
    }
    catch (error) {
        console.error('Error in leaveGame:', error);
        socket.emit('leaveGameError', 'Error occurred in leaveGame');
    }
});
exports.leaveGame = leaveGame;
const joinGame = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    try {
        const { roomId, token } = data;
        const userId = (0, authenticate_1.verifyToken)(token);
        if (!userId) {
            socket.emit('joinError', 'Invalid or expired token');
            return;
        }
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
        yield (updatedGame === null || updatedGame === void 0 ? void 0 : updatedGame.save());
        const playerIds = updatedGame === null || updatedGame === void 0 ? void 0 : updatedGame.players;
        const players = yield playerModel_1.default.find({ _id: { $in: playerIds } });
        const playerNames = players.map(player => player.username);
        let DTO = {
            createdAt: (updatedGame === null || updatedGame === void 0 ? void 0 : updatedGame.createdAt) ? updatedGame === null || updatedGame === void 0 ? void 0 : updatedGame.createdAt : null,
            players: playerNames,
            status: (updatedGame === null || updatedGame === void 0 ? void 0 : updatedGame.status) ? updatedGame === null || updatedGame === void 0 ? void 0 : updatedGame.status : "waiting",
            gameId: (updatedGame === null || updatedGame === void 0 ? void 0 : updatedGame.gameId) ? updatedGame === null || updatedGame === void 0 ? void 0 : updatedGame.gameId : "Error",
            createdBy: (_e = (_d = (yield playerModel_1.default.findById(updatedGame === null || updatedGame === void 0 ? void 0 : updatedGame.createdBy))) === null || _d === void 0 ? void 0 : _d.username) !== null && _e !== void 0 ? _e : "Unknown"
        };
        socket.join(roomId);
        // socket.emit('gameJoined', { DTO });
        // socket.broadcast.emit('gameJoined', { DTO });
        app_1.io.to(roomId).emit('gameJoined', { DTO });
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
        const game = yield gameRepo.getById(roomId);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        if (game.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this game' });
        }
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
            //questions: questions.map(q => q._id),
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
        const waitingGames = yield gameRepo.getGamesByStatus('Waiting');
        res.json(waitingGames);
    }
    catch (error) {
        console.error('Error in getWaitingGames:', error);
        res.status(500).send('Error fetching waiting games');
    }
});
exports.getAllAvailableGames = getAllAvailableGames;
