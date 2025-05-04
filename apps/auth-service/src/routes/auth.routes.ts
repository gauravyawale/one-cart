import { Router } from 'express';
import { loginUser, signupSendOtp, signupVerify, refreshAccessToken} from '../controllers/auth.controller';
import { loginSchema, signupSendOtpSchema, signupVerifySchema } from '../validations/auth.validation';
import { validate } from '@one-cart/common';

const router = Router();

router.post('/signup/send-otp', validate(signupSendOtpSchema), signupSendOtp);
router.post('/signup/verify', validate(signupVerifySchema), signupVerify);
router.post('/login', validate(loginSchema), loginUser);
router.post('/refresh-token', refreshAccessToken);

export default router;
