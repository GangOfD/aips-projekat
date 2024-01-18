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
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const mongodb_1 = __importDefault(require("./database/mongodb"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const questionRoutes_1 = __importDefault(require("./routes/questionRoutes"));
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
const playerRoutes_1 = __importDefault(require("./routes/playerRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const gameController_1 = require("./controllers/gameController");
const authenticate_1 = require("./middleware/authenticate");
const AnswerCommand_1 = __importDefault(require("../src/commands/AnswerCommand"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
(0, mongodb_1.default)();
initializeQuestions();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/config', (req, res) => {
    res.json({ port: process.env.PORT });
});
// Routes
app.use('/auth', authRoutes_1.default);
app.use('/question', questionRoutes_1.default);
app.use('/games', gameRoutes_1.default);
app.use('/player', playerRoutes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer);
exports.io = io;
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('joinGame', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, gameController_1.joinGame)(data, socket);
        }
        catch (error) {
            console.error('Error in socket joinGame:', error);
            socket.emit('joinError', 'Error joining game');
        }
    }));
    socket.on('startGame', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = (0, authenticate_1.verifyToken)(data.token);
            if (!userId) {
                socket.emit('startError', 'Invalid or expired token');
                return;
            }
            const modifiedData = Object.assign(Object.assign({}, data), { userId });
            yield (0, gameController_1.startGame)(modifiedData, socket);
        }
        catch (error) {
            console.error('Error in socket startGame:', error);
            socket.emit('startError', 'Error starting the game');
        }
    }));
    socket.on('leaveGame', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, gameController_1.leaveGame)(data, socket);
        }
        catch (error) {
            console.error('Error in socket leaveGame:', error);
            socket.emit('leaveGameError', 'Error leaving game');
        }
    }));
    socket.on('receiveAnswer', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = data.token;
            const userId = (0, authenticate_1.verifyToken)(token);
            if (!userId) {
                throw new Error('Invalid or expired token');
            }
            const { answerValue, gameId } = data;
            const command = new AnswerCommand_1.default(userId, answerValue, gameId);
            command.execute();
            socket.emit('answerReceived', { userId: userId, status: 'success' });
        }
        catch (error) {
            console.error('Error in socket receiveAnswer:', error);
            socket.emit('receiveAnswerError', { error: 'Error while answering' });
        }
    }));
});
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
function initializeQuestions() {
    throw new Error('Function not implemented.');
}
