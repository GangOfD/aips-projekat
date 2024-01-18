"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameController_1 = require("../controllers/gameController");
const authenticate_1 = require("../middleware/authenticate");
const router = express_1.default.Router();
router.post('/', authenticate_1.authenticateUser, gameController_1.createGame);
router.get('/All', gameController_1.getAllGames);
router.get('/Active', authenticate_1.authenticateUser, gameController_1.getAllAvailableGames);
router.delete('/', authenticate_1.authenticateUser, gameController_1.deleteGame);
// router.post('/join',authenticateUser,joinGame);
exports.default = router;
