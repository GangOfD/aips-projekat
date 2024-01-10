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
exports.findPlayerByIdOrName = void 0;
const playerModel_1 = __importDefault(require("../models/playerModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const findPlayerByIdOrName = (identifier) => __awaiter(void 0, void 0, void 0, function* () {
    const isValidObjectId = mongoose_1.default.Types.ObjectId.isValid(identifier);
    let query;
    if (isValidObjectId) {
        query = { _id: identifier };
    }
    else {
        query = { username: identifier };
    }
    try {
        const player = yield playerModel_1.default.findOne(query);
        return player;
    }
    catch (error) {
        console.error('Error finding player:', error);
        return null;
    }
});
exports.findPlayerByIdOrName = findPlayerByIdOrName;
