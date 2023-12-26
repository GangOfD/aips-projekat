import { Request, Response } from 'express';
import Player from '../models/playerModel';
import { findPlayerByIdOrName } from '../utils/findPlayer';
import { isValidEmail } from '../utils/emailValidation'
import bcrypt from 'bcrypt'
import { platform } from 'os';
import {validPassword} from '../utils/validPassword'


export const updatePlayer = async (req: Request, res: Response) => {
    const { IdOrName } = req.params;
    const { username, email, oldPassword,newPassword, age } = req.body;

    try {
        const playerToUpdate = await findPlayerByIdOrName(IdOrName);

        if (!playerToUpdate) {
            return res.status(404).json({ message: 'Player not found' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, playerToUpdate.password);

        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Incorrect password, unable to delete player' });
        }

        const updateFields: any = {};

        if (username !== undefined && !await Player.findOne({username:username})) {
            updateFields.username = username;
        }

        if (email !== playerToUpdate.email && isValidEmail(email)) {
            updateFields.email = email;
        } 

        if (age !== undefined && age!=playerToUpdate.age) {
            updateFields.age = age;
        }

        const newPasswordValidation = validPassword(newPassword);

        if (newPasswordValidation.valid) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
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

        const updatedFieldsList = Object.keys(updateFields).join(', ');
        const message = `Player updated successfully. Updated fields: ${updatedFieldsList}`;

        const response = {
            message,
            user: {
                age: playerToUpdate.age,
                email: playerToUpdate.email,
                username: playerToUpdate.username,
            },
        };

        res.json(response);
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
        console.log(IdOrName);
        
        return res.status(404).json({ message: 'Player not found' });
      }

      const isPasswordValid = await bcrypt.compare(req.body.oldPassword, playerToDelete.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password, unable to delete player' });
    }

      await Player.deleteOne({ _id: playerToDelete._id });
      
      res.json({ message: 'Player deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


