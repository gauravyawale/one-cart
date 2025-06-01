import bcrypt from 'bcrypt';
import { User, IUser, generateAccessToken, generateRefreshToken, verifyRefreshToken, UserRole } from '@one-cart/common';
import { isGuestLoginEnabled } from '../utils/featureFlags';
import redis from '../config/redis.config';
import { getMaxAgeInDays, getMaxAgeInMinutes } from '../utils/cookie';

export const signup = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: 'customer' | 'admin' | 'seller' = 'customer',
): Promise<IUser> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    isVerified: true, // Assuming auto-verification for simplicity
  });
  await newUser.save();

  return newUser;
};

export const login = async (
  email: string,
  password: string,
): Promise<{ user: IUser; accessToken: string, refreshToken: string }> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isVerified) {
    throw new Error('Email not verified. Please verify your email.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const paylaod = { id: user._id, email: user.email, role: user.role };

  const accessToken = generateAccessToken(paylaod, getMaxAgeInMinutes(15), process.env.JWT_ACCESS_TOKEN_SECRET as string);;
  const refreshToken = generateRefreshToken(paylaod, getMaxAgeInDays(7), process.env.JWT_REFRESH_TOKEN_SECRET as string);;

  return { user, accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> => {
  if (!refreshToken) {
    throw new Error('Refresh token not provided');
  }

  const payload: IUser = verifyRefreshToken(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET as string) as IUser;
  if (!payload) {
    throw new Error('Invalid refresh token');
  }

  const user = await User.findById(payload.id);
  if (!user) {
    throw new Error('User not found');
  }

  const newAccessToken = generateAccessToken(user, getMaxAgeInMinutes(15), process.env.JWT_ACCESS_TOKEN_SECRET as string);
  const newRefreshToken = generateRefreshToken(user, getMaxAgeInDays(7), process.env.JWT_REFRESH_TOKEN_SECRET as string);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export const resetPassword = async (email: string, newPassword: string): Promise<void> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
}

export const changePassword = async (email: string, oldPassword: string, newPassword: string): Promise<void> => {
  const user = await User.findById(email);
  if (!user) {
    throw new Error('User not found');
  }
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error('Old password is incorrect');
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
};

export const loginAsGuest = async (ip: string): Promise<{ user: IUser; accessToken: string, refreshToken: string }> => {
  if (!isGuestLoginEnabled()) {
    throw new Error('Guest login is not enabled');
  }
  const redisKey = `guest_login:${ip}`;
  const existingGuestId = await redis.get(redisKey);

  if (existingGuestId) {
    const existingGuestUser = await User.findById(existingGuestId);
    if (existingGuestUser) {
      const payload = { id: existingGuestUser._id, email: existingGuestUser.email, role: existingGuestUser.role };
      const accessToken = generateAccessToken(payload, getMaxAgeInMinutes(15), process.env.JWT_ACCESS_TOKEN_SECRET as string);
      const refreshToken = generateRefreshToken(payload, getMaxAgeInMinutes(60), process.env.JWT_REFRESH_TOKEN_SECRET as string);
      return { user: existingGuestUser, accessToken, refreshToken };
    }
  }
  const dateNow = Date.now();
  const hashedPassword = await bcrypt.hash(`${ip}${dateNow}`, 10);
  const guestUser = new User({
    firstName: 'Guest',
    lastName: 'User',
    email: `guest-${dateNow}@guest.onecart`,
    password: hashedPassword,
    role: UserRole.GUEST,
    isVerified: true, // Assuming guest users are auto-verified
  });

  await guestUser.save();

  const payload = { id: guestUser._id, email: guestUser.email, role: guestUser.role };

  const accessToken = generateAccessToken(payload, getMaxAgeInMinutes(15), process.env.JWT_ACCESS_TOKEN_SECRET as string);
  const refreshToken = generateRefreshToken(payload, getMaxAgeInMinutes(60), process.env.JWT_REFRESH_TOKEN_SECRET as string);

  await redis.set(redisKey, String(guestUser._id), "EX", 3600); // Store guest user ID in Redis for 1 hour

  return { user: guestUser, accessToken, refreshToken };
}