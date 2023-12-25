import express, { Application, Request, Response } from 'express';
import connectDB from './database/mongodb'
import authRoutes from './routes/authRoutes';
import questionRoutes from './routes/questionRoutes';
import gameRoutes from './routes/gameRoutes'
import playerRoutes from './routes/playerRoutes'

import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();



const app: Application = express();
console.log('MongoDB Preparing...');
app.use(cors());


connectDB()

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Basic Route
app.get('/home', (req: Request, res: Response) => {
    res.send('Hello World from HigherLower!');
});

app.get('/config', (req, res) => {
    res.json({ port:process.env.PORT });
  });

// app.use('/api/users', usersRouter);
// app.use('/api/posts', postsRouter);
app.use('/auth',authRoutes)
app.use('/question',questionRoutes)
app.use('/games', gameRoutes);
app.use('/player', playerRoutes);



//Middleware, error handling
app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
