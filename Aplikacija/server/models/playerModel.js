const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    username :{
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
    },
    age: {
        type: Number,
        default: 0,
    },
    dateOfBirth: {
        type: Date,
    },
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
