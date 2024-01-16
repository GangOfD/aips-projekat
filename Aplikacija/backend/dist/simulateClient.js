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
exports.simulateClient = void 0;
// simulateClient.ts
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const simulateClient = () => {
    const socket = (0, socket_io_client_1.default)('http://localhost:3002');
    socket.on('connect', () => {
        console.log('\x1b[34m', 'Simulated client connected');
        socket.emit('joinGame', { roomId: '67', userId: '657f1f0a3176e2817db8312c' });
        socket.emit('receiveAnswer', { roomId: '67', userId: '657f1f0a3176e2817db8312c' });
        socket.on('newQuestion', (data) => {
            console.log('\x1b[34m', 'Stiglo pitanje:', data);
        });
        socket.on('questionResults', (data) => {
            console.log('\x1b[34m', 'Stigli rezultati:', data);
        });
        socket.on('gameJoined', (data) => {
            console.log('\x1b[34m', 'Joined game:', data);
        });
        socket.on('gameOver', (data) => {
            console.log('\x1b[34m', 'Game is over, final results are: ', data);
        });
        socket.on('gameStarted', (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                //redirektujes, prikazes data, ime sobe i korisnici koji su u sobi.
                console.log('\x1b[34m', "Socket is receiving! Game started!");
            }
            catch (error) {
                console.error('\x1b[34m', 'Error in socket joinGame:', error);
                socket.emit('joinError', 'Error joining game');
            }
        }));
    });
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Simulated client disconnected');
    });
};
exports.simulateClient = simulateClient;
