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


dotenv.config();
const PORT = process.env.PORT || 3000;


const app: Application = express();
app.use(cors());

connectDB();
// removeDuplicateQuestions()

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/config', (req, res) => {
  res.json({ port: process.env.PORT });
});

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

io.on('connection', (socket) => {
    console.log('A user connected');


    socket.on('joinGame', async (data) => {
      try {
        await joinGame(data, socket);
      } catch (error) {
        console.error('Error in socket joinGame:', error);
        socket.emit('joinError', 'Error joining game');
      }
    });


    socket.on('startGame', async (data) => {
      try {
        const userId = verifyToken(data.token);
        if (!userId) {
          socket.emit('startError', 'Invalid or expired token');
          return;
        }
        
        const modifiedData = { ...data, userId };
        await startGame(modifiedData, socket);
      } catch (error) {
        console.error('Error in socket startGame:', error);
        socket.emit('startError', 'Error starting the game');
      }
    });
    


    socket.on('leaveGame', async (data) => {
      try {
        const userId = verifyToken(data.token);
        if (!userId) {
          socket.emit('leaveError', 'Invalid or expired token');
          return;
        }

        const modifiedData = { ...data, userId };

        await leaveGame(modifiedData, socket);
      } catch (error) {
        console.error('Error in socket leaveGame:', error);
        socket.emit('leaveGameError', 'Error leaving game');
      }
    });

    socket.on('receiveAnswer', async (data) => {
      try {
          const token = data.token;
          const userId = verifyToken(token); 

          if (!userId) {
              throw new Error('Invalid or expired token');
          }

          const { answerValue,gameId } = data;

          const command = new AnswerCommand(userId, answerValue,gameId);

          command.execute();

          socket.emit('answerReceived', { userId: userId, status: 'success' });

      } catch (error) {
          console.error('Error in socket receiveAnswer:', error);
          socket.emit('receiveAnswerError', { error: 'Error while answering' });
      }
  });

  });

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//simulateClient();
export { io };

export default app;

