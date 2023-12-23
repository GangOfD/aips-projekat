"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const questionSchema = new mongoose_1.Schema({
    questionText: {
        type: String,
        required: true,
    },
    options: {
        type: [{
                text: { type: String, required: true },
                picture: { type: String, required: true }
            }],
        required: true,
        validate: [
            (value) => value.length === 2,
            'Options array must contain exactly two items.',
        ],
    },
    correctAnswerIndex: {
        type: Number,
        required: true,
        // validate: {
        //   validator: function(value: number) {
        //     return value >= 0 && value < this.options.length;
        //   },
        //   message: 'Correct answer index must be within the range of the options array.',
        // },
    },
});
const Question = mongoose_1.default.model('Question', questionSchema);
exports.default = Question;
