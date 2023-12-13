const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    options: {
        type: [
            {
                text: String,
                picture: String,
            },
        ],
        required: true,
        validate: [arrayLengthValidator, 'Options array must contain exactly two items.'],
    },
    correctAnswer: {
        type: String,
        required: true,
        validate: [correctAnswerValidator, 'Correct answer must match one of the options.'],
    },
});

function arrayLengthValidator(value) {
    return value.length === 2;
}

function correctAnswerValidator(value) {
    const optionsTexts = this.options.map((option) => option.text);
    return optionsTexts.includes(value);
}

const Question = mongoose.model('Question', questionSchema);

module.exports = { Question };
