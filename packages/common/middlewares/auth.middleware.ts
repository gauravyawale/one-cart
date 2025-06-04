import { verifyAccessToken } from '@one-cart/common';
import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (jwtSecret: string):any => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const token = req.cookies.access_token;

    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    };

    try {
      const decoded = verifyAccessToken(token, jwtSecret);
      if (!decoded) {
        res.status(403).json({ error: 'Invalid token' });
        return;
      }
      // Attach the decoded user information to the request object
      // This allows you to access user info in subsequent middleware or route handlers
      // For example, you can access it as req.user in your route handlers
      req.user = decoded;
      next();
    } catch (error) {
      res.status(403).json({ error: 'Token expired or invalid' });
      return;
    }
  }
};
