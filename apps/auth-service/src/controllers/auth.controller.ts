import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { verifyToken } from '../utils/jwt';
import User from '../models/user.model';
import { error } from 'console';

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const role = req.body.role || 'customer'; // Default to 'customer' if not provided
    const user = await authService.signup(email, password, firstName, lastName, role);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.query.token;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token is required' });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'User already verified' });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: 'User verified successfully' });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
