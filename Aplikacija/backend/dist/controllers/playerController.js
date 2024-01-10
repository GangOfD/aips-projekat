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
exports.deletePlayer = exports.updatePlayer = void 0;
const playerModel_1 = __importDefault(require("../models/playerModel"));
const findPlayer_1 = require("../utils/findPlayer");
const emailValidation_1 = require("../utils/emailValidation");
const bcrypt_1 = __importDefault(require("bcrypt"));
const validPassword_1 = require("../utils/validPassword");
const updatePlayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { IdOrName } = req.params;
    const { username, email, oldPassword, newPassword, age } = req.body;
    try {
        const playerToUpdate = yield (0, findPlayer_1.findPlayerByIdOrName)(IdOrName);
        if (!playerToUpdate) {
            return res.status(404).json({ message: 'Player not found' });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(oldPassword, playerToUpdate.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        const updateFields = {};
        if (username && !(yield playerModel_1.default.findOne({ username: username }))) {
            updateFields.username = username;
        }
        if (email !== playerToUpdate.email && (0, emailValidation_1.isValidEmail)(email)) {
            updateFields.email = email;
        }
        if (age !== undefined && age != playerToUpdate.age) {
            updateFields.age = age;
        }
        const newPasswordValidation = (0, validPassword_1.validPassword)(newPassword);
        if (newPasswordValidation.valid) {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
            updateFields.password = hashedPassword;
        }
        const updatedPlayer = yield playerModel_1.default.findByIdAndUpdate(playerToUpdate._id, updateFields, { new: true });
        if (!updatedPlayer) {
            return res.status(404).json({ message: 'Player not found' });
        }
        const updatedFieldsList = Object.keys(updateFields).join(', ');
        const message = `Player updated successfully. Updated fields: ${updatedFieldsList}`;
        const response = {
            message,
            user: {
                age: updatedPlayer.age,
                email: updatedPlayer.email,
                username: updatedPlayer.username,
            },
        };
        res.json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.updatePlayer = updatePlayer;
const deletePlayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { IdOrName } = req.params;
    try {
        const playerToDelete = yield (0, findPlayer_1.findPlayerByIdOrName)(IdOrName);
        if (!playerToDelete) {
            console.log(IdOrName);
            return res.status(404).json({ message: 'Player not found' });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(req.body.oldPassword, playerToDelete.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password, unable to delete player' });
        }
        yield playerModel_1.default.deleteOne({ _id: playerToDelete._id });
        res.json({ message: 'Player deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.deletePlayer = deletePlayer;
