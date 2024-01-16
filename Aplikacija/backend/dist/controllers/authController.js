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
exports.loginPlayer = exports.registerPlayer = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const playerModel_1 = __importDefault(require("../models/playerModel"));
const userDto_1 = __importDefault(require("../models/userDto"));
const playerRepository_1 = require("../repository/playerRepository");
const playerRepo = new playerRepository_1.PlayerRepository(playerModel_1.default);
const registerPlayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, age } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const player = new playerModel_1.default({ username, email, password: hashedPassword, age });
        yield playerRepo.create(player);
        // await player.save();
        res.status(201).json({ message: 'Player registered successfully!' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.registerPlayer = registerPlayer;
const loginPlayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // const player = await Player.findOne({ email });
        const player = yield playerRepo.findByEmail(email);
        if (!player)
            return res.status(400).json({ message: 'Invalid email or password' });
        const validPassword = yield bcrypt_1.default.compare(password, player.password);
        if (!validPassword)
            return res.status(400).json({ message: 'Invalid email or password' });
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in the environment');
        }
        let user;
        user = new userDto_1.default(player.email, player.username, player.age);
        const token = jsonwebtoken_1.default.sign({ _id: player._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.header('auth-token', token).json({ message: 'Logged in successfully', token, user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.loginPlayer = loginPlayer;
