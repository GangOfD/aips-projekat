import Question from '../models/questionModel';
import { questionsData } from './questionData';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function initializeQuestions() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);

        for (const questionData of questionsData) {
            const question = new Question(questionData);
            await question.save();
        }

        console.log("Questions have been initialized in the database.");
    } catch (error) {
        console.error("Error initializing questions:", error);
    }
}
