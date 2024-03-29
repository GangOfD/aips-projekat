"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validPassword_1 = require("../utils/validPassword");
const playerSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate: {
            validator: validPassword_1.validPassword,
            message: 'Validate password message',
        },
    },
    age: {
        type: Number,
        default: 0,
        min: 3,
        max: 103,
    },
    winRate: {
        type: Number,
        default: undefined,
        min: 0,
        max: 100
    }
});
const Player = mongoose_1.default.model('Player', playerSchema);
exports.default = Player;
