import express, { Application, Request, Response } from 'express';
import connectDB from './database/mongodb'
import authRoutes from './routes/authRoutes';
import questionRoutes from './routes/questionRoutes';
import gameRoutes from './routes/gameRoutes'

import dotenv from 'dotenv';
dotenv.config();



const app: Application = express();
console.log('MongoDB Preparing...');

connectDB()

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Basic Route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World from HigherLower!');
});

// app.use('/api/users', usersRouter);
// app.use('/api/posts', postsRouter);
app.use('/auth',authRoutes)
app.use('/question',questionRoutes)
app.use('/games', gameRoutes);


//Middleware, error handling
app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
