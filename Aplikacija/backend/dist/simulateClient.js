"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateClient = void 0;
// simulateClient.ts
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const simulateClient = () => {
    const socket = (0, socket_io_client_1.default)('http://localhost:3002'); // Update the URL to match your server
    socket.on('connect', () => {
        console.log('Simulated client connected');
        // Emit events or perform actions as the client
        socket.emit('joinGame', { roomId: '67', userId: '657deb4e40fd08aea087377c' });
        // Handle any events that the server sends to the client
        socket.on('gameJoined', (data) => {
            console.log('Joined game:', data);
        });
    });
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Simulated client disconnected');
    });
};
exports.simulateClient = simulateClient;
