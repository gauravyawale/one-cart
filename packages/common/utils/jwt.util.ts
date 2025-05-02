import jwt from 'jsonwebtoken';

const JWT_ACCESS_TOKEN_SECRET: jwt.Secret = process.env.JWT_SECRET_KEY || 'secretkey-very-long-and-random';
const JWT_REFRESH_TOKEN_SECRET: jwt.Secret = process.env.JWT_SECRET_KEY || 'secretkey-very-long-and-random';

export const generateAccessToken = (payload: Object, expiresIn = '15m'): string => {
  return jwt.sign({
    exp: expiresIn,
    data: payload
  }, JWT_ACCESS_TOKEN_SECRET);
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  } catch (err) {
    return null;
  }
};

export const generateRefreshToken = (payload: Object, expiresIn = '7d'): string => {
  return jwt.sign({
    exp: expiresIn,
    data: payload
  }, JWT_REFRESH_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  } catch (err) {
    return null;
  }
};