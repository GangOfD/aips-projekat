import express from 'express';
import gameController from '../controllers/gameController';

const router = express.Router();

router.post('/', gameController.createGame);
router.get('/', gameController.getAllGames);



export default router;
