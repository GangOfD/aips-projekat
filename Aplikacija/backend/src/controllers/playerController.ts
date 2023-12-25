import { Request, Response } from 'express';
import Player from '../models/playerModel';
import { findPlayerByIdOrName } from '../utils/findPlayer';
import { isValidEmail } from '../utils/emailValidation'
import bcrypt from 'bcrypt'


export const updatePlayer = async (req: Request, res: Response) => {
    const { IdOrName } = req.params;
    const { username, email, password, age } = req.body;

    try {
        const playerToUpdate = await findPlayerByIdOrName(IdOrName);

        if (!playerToUpdate) {
            return res.status(404).json({ message: 'Player not found' });
        }

        const updateFields: any = {};

        if (username !== undefined && !await Player.findOne({username:username})) {
            updateFields.username = username;
        }

        if (email !== undefined && isValidEmail(email)) {
            updateFields.email = email;
        } else if (email !== undefined) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (age !== undefined) {
            updateFields.age = age;
        }

        if (password !== undefined) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }

        const updatedPlayer = await Player.findByIdAndUpdate(
            playerToUpdate._id,
            updateFields,
            { new: true }
        );

        if (!updatedPlayer) {
            return res.status(404).json({ message: 'Player not found' });
        }

        res.json(updatedPlayer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


  

export const deletePlayer = async (req: Request, res: Response) => {
    const { IdOrName } = req.params;
  
    try {
      const playerToDelete = await findPlayerByIdOrName(IdOrName);
  
      if (!playerToDelete) {
        return res.status(404).json({ message: 'Player not found' });
      }

      await Player.deleteOne({ _id: playerToDelete._id });
      
      res.json({ message: 'Player deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


