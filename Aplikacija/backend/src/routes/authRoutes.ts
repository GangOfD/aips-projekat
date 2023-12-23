import express from 'express';
import { registerPlayer, loginPlayer } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerPlayer);
router.post('/login', loginPlayer);

export default router;
