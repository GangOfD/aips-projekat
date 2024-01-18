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

export async function removeDuplicateQuestions() {
    try {
      const pipeline = [
        {
          $group: {
            _id: '$question', // Group by the 'question' field
            count: { $sum: 1 }, // Count the number of duplicates
            docs: { $push: '$$ROOT' }, // Store all documents in the group
          },
        },
        {
          $match: {
            count: { $gt: 1 }, // Filter for groups with duplicates
          },
        },
        {
          $unwind: '$docs', // Flatten the array of documents in each group
        },
        {
          $replaceRoot: { newRoot: '$docs' }, // Replace the root with the distinct documents
        },
        {
          $out: 'questions_without_duplicates', // Store the distinct documents in a new collection
        },
      ];
  
      await Question.aggregate(pipeline).exec();
      console.log('Duplicate questions removed, and distinct questions stored in a new collection.');
    } catch (error) {
      console.error('Error removing duplicate questions:', error);
    } finally {
      mongoose.disconnect();
    }
  }
