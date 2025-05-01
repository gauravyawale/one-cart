import bcrypt from 'bcrypt';
import { User, IUser, sendEmail, generateToken } from '@one-cart/common';

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
  });
  await newUser.save();

  // Generate verification token
  const verifyToken = generateToken({ id: newUser._id, role }, '1d'); // expire in 1 day

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;

  const emailContent = `
    <h1>Verify your email</h1>
    <p>Click the link below to verify your email:</p>
    <a href="${verificationLink}">Verify Email</a>
  `;

  await sendEmail(email, 'Verify your email', emailContent);

  return newUser;
};

export const login = async (
  email: string,
  password: string,
): Promise<{ user: IUser; token: string }> => {
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

  const token = generateToken({ id: user._id, email: user.email });

  return { user, token };
};
