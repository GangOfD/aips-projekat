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
import { joinGame } from './controllers/gameController';
import { simulateClient } from './simulateClient';

dotenv.config();

const app: Application = express();
console.log('MongoDB Preparing...');
app.use(cors());

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/home', (req: Request, res: Response) => {
  res.send('Hello World from HigherLower!');
});

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

  });

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
setTimeout(() => {
    const fakeClientData = { roomId: '67', userId: '657f1f0a3176e2817db8312c' };
  
    io.emit('joinGame', fakeClientData);
  }, 5000);
export { io };
simulateClient();

export default app;
