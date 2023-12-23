"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = __importDefault(require("./database/mongodb"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const questionRoutes_1 = __importDefault(require("./routes/questionRoutes"));
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
console.log('MongoDB Preparing...');
app.use((0, cors_1.default)());
(0, mongodb_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Basic Route
app.get('/home', (req, res) => {
    res.send('Hello World from HigherLower!');
});
app.get('/config', (req, res) => {
    res.json({ port: process.env.PORT });
});
// app.use('/api/users', usersRouter);
// app.use('/api/posts', postsRouter);
app.use('/auth', authRoutes_1.default);
app.use('/question', questionRoutes_1.default);
app.use('/games', gameRoutes_1.default);
//Middleware, error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
exports.default = app;
