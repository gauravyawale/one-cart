import { Router } from 'express';
import { loginUser, signupSendOtp, signupVerify, refreshAccessToken, logoutUser, changePassword, resetPassword, forgotPassword, loginAsGuest} from '../controllers/auth.controller';
import { loginSchema, signupSendOtpSchema, signupVerifySchema } from '../validations/auth.validation';
import { authenticate, validate } from '@one-cart/common';

const router = Router();

// Authentication routes
// POST /auth/signup/send-otp - Send OTP for signup
router.post('/signup/send-otp', validate(signupSendOtpSchema), signupSendOtp);
// POST /auth/signup/verify - Verify OTP and create user
router.post('/signup/verify', validate(signupVerifySchema), signupVerify);
// POST /auth/login - Login user
router.post('/login', validate(loginSchema), loginUser);
// POST /auth/refresh-token - Refresh access token
router.post('/refresh-token', refreshAccessToken);
// POST /auth/forgot-password - Send OTP for password reset
router.post('/forgot-password', forgotPassword);
// POST /auth/reset-password - Reset password using OTP
router.post('/reset-password', resetPassword);
// POST /auth/change-password - Change user password
router.post('/change-password', authenticate, changePassword);
// GET /auth/logout - Logout user
router.get('/logout', logoutUser);
// POST /auth/guest-login - Login as guest user
router.post('/guest-login', loginAsGuest);

export default router;
