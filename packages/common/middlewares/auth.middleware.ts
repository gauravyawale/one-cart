import { verifyAccessToken } from '@one-cart/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token expired or invalid' });
  }
};
