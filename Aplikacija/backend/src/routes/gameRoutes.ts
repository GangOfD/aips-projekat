import express from 'express';
import {joinGame,createGame,deleteGame,getAllGames,getAllAvailableGames, restartGame} from '../controllers/gameController';
import {authenticateUser} from '../middleware/authenticate'


const router = express.Router();

router.post('/',authenticateUser, createGame);  
router.get('/All', getAllGames); 
router.get('/Active', authenticateUser,getAllAvailableGames); 
router.delete('/',authenticateUser, deleteGame);

// router.post('/join',authenticateUser,joinGame);




export default router;
