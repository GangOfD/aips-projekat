import express from 'express';
import { getQuestions, addQuestion, getQuestion, updateQuestion, deleteQuestion } from '../controllers/questionController';

const router = express.Router();

router.get('/', getQuestions);
router.post('/', addQuestion);
router.get('/:questionId', getQuestion);
router.put('/:questionId', updateQuestion);
router.delete('/:questionId', deleteQuestion);

export default router;
