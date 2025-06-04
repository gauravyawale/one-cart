import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { UserRole } from '@one-cart/common';
import { sendForgotPWOtp, sendOtp } from '../services/otp.service';
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
    res.cookie('access_token', accessToken, accessTokenOptions);
    res.cookie('refresh_token', refreshToken, refreshTokenOptions);
    res.status(200).json({ message: 'Login successful', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const refreshAccessToken = async (req: Request, res: Response):Promise<any> => {
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

export const logoutUser = async (req: Request, res: Response): Promise<any> => {
  try {
    res.clearCookie('access_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.clearCookie('refresh_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    await sendForgotPWOtp(email);
    // Logic to handle forgot password, e.g., send reset link
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, newPassword, otp } = req.body;
    const storedOtp = await redis.get(`reset_pw_otp:${email}`);
    if (!storedOtp) {
      return res.status(400).json({ error: 'OTP expired or not found' });
    }
    if (otp !== storedOtp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    await redis.del(`reset_pw_otp:${email}`); // Delete OTP after verification
    await authService.resetPassword(email, newPassword);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const changePassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    await authService.changePassword(email, oldPassword, newPassword);
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const loginAsGuest = async (req: Request, res: Response): Promise<any> => {
  try {
    const guestIp = req.ip || req.connection.remoteAddress || '';
    const { accessToken, refreshToken } = await authService.loginAsGuest(guestIp);
    res.cookie('access_token', accessToken, accessTokenOptions);
    res.cookie('refresh_token', refreshToken, refreshTokenOptions);
    res.status(200).json({ message: 'Guest login successful' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};