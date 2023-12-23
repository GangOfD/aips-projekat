"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionController_1 = require("../controllers/questionController");
const router = express_1.default.Router();
router.get('/', questionController_1.getQuestions);
router.post('/', questionController_1.addQuestion);
router.get('/:questionId', questionController_1.getQuestion);
router.put('/:questionId', questionController_1.updateQuestion);
router.delete('/:questionId', questionController_1.deleteQuestion);
exports.default = router;
