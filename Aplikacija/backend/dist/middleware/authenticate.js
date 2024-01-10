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
exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const playerModel_1 = __importDefault(require("../models/playerModel"));
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // const token = req.header('Authorization'); 
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Please log in.' });
    }
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in the environment');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = decoded ? decoded._id : undefined;
        if (userId) {
            console.log('User ID:', userId);
        }
        else {
            console.error('User ID not found in the token');
        }
        console.log("Dosli smo do asda");
        req.userId = decoded._id;
        const user = yield playerModel_1.default.findById(decoded._id);
        if (!user) {
            console.log("Cant find user ", token);
            return res.status(401).json({ message: 'User not found' });
        }
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            console.error("Token is expired");
            return res.status(401).json({ message: 'Token is expired' });
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.error("Invalid token");
            return res.status(401).json({ message: 'Invalid token' });
        }
        else {
            console.error("Unknown error during token verification:", error instanceof Error ? error.message : "Unknown");
        }
        res.status(401).json({ message: 'Invalid token' });
    }
});
exports.authenticateUser = authenticateUser;
