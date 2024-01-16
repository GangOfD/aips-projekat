"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function IQuestionToQuestionDto(question) {
    const questionDto = {
        questionText: question.question,
        options: question.options.map((option) => option.text),
        img: undefined,
    };
    return questionDto;
}
exports.default = IQuestionToQuestionDto;
