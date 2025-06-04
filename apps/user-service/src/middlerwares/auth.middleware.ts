import { Request, Response, NextFunction } from 'express';
import { User, verifyAccessToken } from '@one-cart/common';
export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): any => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token, process.env.ACCESS_TOKEN_SECRET as string);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const user = await User.findById(decoded.id);
  if (!user) return res.status(401).json({ error: 'User not found' });

  req.user = user;

  next();
};
