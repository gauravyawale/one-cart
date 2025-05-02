import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { User, IUser, UserRole } from '@one-cart/common';
import { sendOtp } from '../services/otp.service';
import redis from '../config/redis.config';
import { accessTokenOptions, refreshTokenOptions } from '../utils/cookie';

export const signupSendOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    await sendOtp(email)
    return res.status(200).json({ message: 'OTP sent to email' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const signupVerify = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, firstName, lastName, otp } = req.body;
    const role = req.body.role || UserRole.CUSTOMER; // Default to 'customer' if not provided

    const storedOtp = await redis.get(`register_otp:${email}`);
    if (!storedOtp) {
      return res.status(400).json({ error: 'OTP expired or not found' });
    }
    if (otp !== storedOtp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    await redis.del(`register_otp:${email}`); // Delete OTP after verification
    const user = await authService.signup(email, password, firstName, lastName, role);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(email, password);

    // set token in cookie
    res.cookie('access_Token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'strict', // CSRF protection
      maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.cookie('refresh_Token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'strict', // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({ message: 'Login successful', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refresh_Token } = req.cookies;
    if (!refresh_Token) {
      return res.status(401).json({ error: 'Refresh token not found' });
    }
    const { accessToken, refreshToken } = await authService.refreshAccessToken(refresh_Token);
    res.cookie('access_Token', accessToken, accessTokenOptions);
    res.cookie('refresh_Token', refreshToken, refreshTokenOptions);
    res.status(200).json({ message: 'Access token refreshed successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};