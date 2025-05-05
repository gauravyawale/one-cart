import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload: Object, expiresIn = '15m', secret: string): string => {
  return jwt.sign({
    exp: expiresIn,
    data: payload
  }, secret);
};

export const verifyAccessToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};

export const generateRefreshToken = (payload: Object, expiresIn = '7d', secret: string): string => {
  return jwt.sign({
    exp: expiresIn,
    data: payload
  }, secret);
};

export const verifyRefreshToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};