import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload: string | object, expiresIn: string, secret: jwt.Secret): string => {
  return jwt.sign(
    payload,
    secret,
    { expiresIn }as jwt.SignOptions
  );
};

export const verifyAccessToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    console.error('Token verification failed:', err);
    return null;
  }
};

export const generateRefreshToken = (payload: Object, expiresIn: number, secret: string): string => {
  return jwt.sign(
    payload,
    secret,
    { expiresIn }as jwt.SignOptions
  );
};

export const verifyRefreshToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};