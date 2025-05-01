import jwt from 'jsonwebtoken';

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET_KEY || 'secretkey-very-long-and-random';

export const generateToken = (payload: Object, expiresIn = '7d'): string => {
  return jwt.sign({
    exp: expiresIn,
    data: payload
  }, JWT_SECRET);
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
