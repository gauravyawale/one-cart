import { sendEmail, User } from "@one-cart/common"
import { generateOtp } from "../utils/generateOtp";
import redis from "../config/redis.config";

export const sendOtp = async (email: string) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exist');
    }
    const otp = generateOtp();

    await redis.set(`register_otp:${email}`, otp, 'EX', 300); // Store OTP in Redis for 5 minutes
    const emailSubject = "Your One-Cart OTP Verification Code";

    const emailContent = `
    <h1>Verify Your Email Address</h1>
    <p>Thank you for signing up with One-Cart!</p>
    <p>Please use the OTP below to verify your email address:</p>
    <h2>${otp}</h2>
    <p>This OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>
    <p>Welcome to One-Cart!</p>
    <p>Best regards,</p>
    <p>The One-Cart Team</p>`;

    await sendEmail(email, emailSubject, emailContent);
}