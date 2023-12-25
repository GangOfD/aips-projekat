import express from 'express';
import { updatePlayer, deletePlayer } from '../controllers/playerController';

const router = express.Router();

router.put('/:IdOrName', updatePlayer);

router.delete('/:IdOrName', deletePlayer);

export default router;
