import express, { Application, Request, Response } from 'express';
import connectDB from './database/mongodb';
import authRoutes from './routes/authRoutes';
import questionRoutes from './routes/questionRoutes';
import gameRoutes from './routes/gameRoutes';
import playerRoutes from './routes/playerRoutes';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { joinGame, leaveGame, startGame } from './controllers/gameController';
import { simulateClient } from './simulateClient';
import { verify } from 'crypto';
import { verifyToken } from './middleware/authenticate';
import AnswerCommand from '../src/commands/AnswerCommand';
import {initializeQuestions, removeDuplicateQuestions} from './calculationService/initQuestions'
import wrapEvent from './eventWrapper'
import { Socket } from 'socket.io';
import {receiveAnswer} from './controllers/answerController'
import { generateAIResponse } from './host/host'
import axios from 'axios';
import { getHostMessage } from './controllers/hostController';
import { HostMessageParams } from './models/hostModel';




dotenv.config();
const PORT = process.env.PORT || 3000;


const app: Application = express();
app.use(cors());

connectDB();

generateAIResponse("Hello buddy. What's up? Do you think that Michael Jordan is the GOAT of basketball? Don't give me too long answer");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/config', (req, res) => {
  res.json({ port: process.env.PORT });
});

app.post('/chat-gpt', async (req, res) => {
  try {
      const { prompt, game_state } = req.body;
      console.log("About to perform")
      const response = await axios.post('http://localhost:5000/chat-gpt', { });
      console.log(response)
      res.json(response.data);
  } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function callChatGptRoute() {
  try {
    
      const response = await axios.post('http://localhost:5000/chat-gpt', { });
      console.log('Response from /chat-gpt route:', response.data);
  } catch (error) { 
      console.error('Error calling /chat-gpt route:', error);
  }
}

//callChatGptRoute()
// Routes
app.use('/auth', authRoutes);
app.use('/question', questionRoutes);
app.use('/games', gameRoutes);
app.use('/player', playerRoutes);

app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

const setupSocketEvents = (io: SocketIOServer) => {
  io.on('connection', (socket) => {
      console.log('A user connected');

      wrapEvent(socket, 'joinGame', joinGame);
      wrapEvent(socket, 'startGame', startGame);
      wrapEvent(socket, 'leaveGame', leaveGame);
      wrapEvent(socket, 'receiveAnswer', receiveAnswer);

  });
};

setupSocketEvents(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


export { io };

export default app;

