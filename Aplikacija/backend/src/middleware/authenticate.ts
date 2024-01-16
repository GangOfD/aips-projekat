import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import Player from '../models/playerModel';

interface AuthRequest extends Request {
  userId?: string; 
}

export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // const token = req.header('Authorization'); 
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Please log in.' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment');
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    const userId: string | undefined = decoded ? decoded._id : undefined;
    
    if (userId) {
      console.log('User ID:', userId);
    } else {
      console.error('User ID not found in the token');
    }
        console.log("Dosli smo do asda");

    req.userId = decoded._id;

    const user = await Player.findById(decoded._id);

    if (!user) {
      console.log("Cant find user ",  token);
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
        console.error("Token is expired");
        return res.status(401).json({ message: 'Token is expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
        console.error("Invalid token");
        return res.status(401).json({ message: 'Invalid token' });
    } else {
        console.error("Unknown error during token verification:", error instanceof Error ? error.message : "Unknown");
    }
    res.status(401).json({ message: 'Invalid token' });
}
};

export const verifyToken = (token: string): string | null => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in the environment');
      return null;
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    return decoded ? decoded._id : null;
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error("Token is expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error("Invalid token");
    } else {
      console.error("Unknown error during token verification:", error instanceof Error ? error.message : "Unknown");
    }
    return null;
  }
};