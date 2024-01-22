import { Request, Response } from 'express';
import { Query } from 'express-serve-static-core'; 
import { QuestionRepository } from '../repository/questionRepository';
import {generateRandomTags}  from '../utils/tagsGenerator'
import Question from '../models/questionModel';
import { IQuestion } from '../models/questionModel';

const questionRepo = new QuestionRepository(Question);


export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await questionRepo.getAll();
    return res.json(questions);
  } catch (error:any) {
    return res.status(500).json({ message: error.message });
  }
};

export const fetchQuestionsForGame = async (numberOfQuestions: number) => {
  try {
    return await questionRepo.getQuestions(numberOfQuestions);
  } catch (error) {
    throw error; 
  }
};

export const addQuestion = async (req: any, res: any) => {
  try {
    const { questionText, options, correctAnswerIndex,tags } = req.body;

    if (!questionText || !Array.isArray(options) || (typeof correctAnswerIndex !== 'number')) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    if (options.length !== 2 || !options.every(opt => opt.text && opt.picture)) {
      return res.status(400).json({ message: "Options must contain exactly two items, each with text and picture" });
    }

    if (correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
      return res.status(400).json({ message: "Invalid correct answer index" });
    }

    const newQuestion = new Question({
      questionText,
      options,
      correctAnswerIndex,
      tags
    });

    await newQuestion.save();

    res.status(201).json({ message: "Question added successfully", question: newQuestion });
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};


export const getQuestion = async (req:any, res:any) => {
};

export const updateQuestion = async (req:any, res:any) => {
};

export const deleteQuestion = async (req:any, res:any) => {
};
