import Game from '../models/gameModel';
import Player from '../models/playerModel'; 
import Question from '../models/questionModel'; 
import { Request, Response } from 'express';

const createGame = async (req: Request, res: Response) => {
    try {
        const { createdBy } = req.body;

        const creator = await Player.findById(createdBy);
        if (!creator) {
            return res.status(404).json({ message: 'Player not found' });
        }

        const questionDocs = await Question.aggregate([{ $sample: { size: 5 } }]);

        const questions = questionDocs.map(doc => ({
            question: doc._id,
            responses: [] 
        }));

        const newGame = new Game({ createdBy, questions, status: 'waiting' });
        await newGame.save();

        res.status(201).json(newGame);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};



const getAllGames = async (res:Response) => {
    try {
        const creator = await Game.find();
        if (!creator) {
            return res.status(404).json({ message: 'Games not found' });
        }

        //paginacija

        res.status(201).json(creator);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    createGame,
    getAllGames
};
