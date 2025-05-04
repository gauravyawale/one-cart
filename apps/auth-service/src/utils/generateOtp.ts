import crypto from 'crypto';

export const generateOtp = (): string => {
    const otp = crypto.randomInt(100000, 999999).toString();
    return otp;
}

export const verifyOtp = (otp: string, storedOtp: string): boolean => {
    return otp === storedOtp;
}