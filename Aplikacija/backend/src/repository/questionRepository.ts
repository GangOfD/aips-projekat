import { Model } from 'mongoose';
import { IQuestion } from '../models/questionModel'; // Ensure this import matches your file structure

export class QuestionRepository {
  private questionModel: Model<IQuestion>;

  constructor(questionModel: Model<IQuestion>) {
    this.questionModel = questionModel;
  }

  async getAll(): Promise<IQuestion[]> {
    try {
      const questions = await this.questionModel.find();
      return questions;
    } catch (error: any) {
        throw new Error(`Error while fetching questions: ${error.message}`);
    }
  }
  
  async getQuestions(limit: number, tags?: string[]): Promise<IQuestion[]> {
    try {
      let query = {};
      if (tags && tags.length > 0) {
        query = { tags: { $in: tags } };
      }
  
      const questions = await this.questionModel.find(query).limit(limit);
      return questions;
    } catch (error: any) {
      throw new Error(`Error while fetching questions: ${error.message}`);
    }
  }

  async getById(id: string): Promise<IQuestion | null> {
    try {
      const question = await this.questionModel.findById(id);
      return question;
    } catch (error: any) {
        throw new Error(`Error while fetching question by ID: ${error.message}`);
    }
  }

  async create(question: IQuestion): Promise<IQuestion> {
    try {
      const createdQuestion = await this.questionModel.create(question);
      return createdQuestion;
    } catch (error: any) {
      throw new Error(`Error while creating question: ${error.message}`);
    }
  }

  async update(id: string, question: Partial<IQuestion>): Promise<IQuestion | null> {
    try {
      const updatedQuestion = await this.questionModel.findByIdAndUpdate(id, question, { new: true });
      return updatedQuestion;
    } catch (error: any) {
        throw new Error(`Error while updating question: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.questionModel.findByIdAndDelete(id);
    } catch (error: any) {
        throw new Error(`Error while deleting question: ${error.message}`);
    }
  }
}
