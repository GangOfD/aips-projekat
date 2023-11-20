const gameSchema = mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true,
    },
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
        },
    ],
    status: {
        type: String,
        enum: ['waiting', 'inProgress', 'completed'],
        default: 'waiting',
    },
    questions: [
        {
            question: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question',
            },
            responses: [
                {
                    player: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Player',
                    },
                    response: {
                        type: String,
                        enum: ['higher', 'lower'],
                        required: true,
                    },
                    points: {
                        type: Number,
                        default: 0,
                    },
                },
            ],
        },
    ],
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = { Game }