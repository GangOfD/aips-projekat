import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Player from '../models/playerModel'; 

export const registerPlayer = async (req:any, res:any) => {
  try {
    const { username, email, password, age } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const player = new Player({ username, email, password: hashedPassword, age });
    await player.save();

    res.status(201).json({ message: 'Player registered successfully!' });
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginPlayer = async (req:any, res:any) => {
  try {
    const { email, password } = req.body;

    const player = await Player.findOne({ email });
    if (!player) return res.status(400).json({ message: 'Invalid email or password' });

    const validPassword = await bcrypt.compare(password, player.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid email or password' });

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment');
    }
    
    const token = jwt.sign({ _id: player._id }, process.env.JWT_SECRET);
        res.header('auth-token', token).json({ message: 'Logged in successfully', token });

  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};
