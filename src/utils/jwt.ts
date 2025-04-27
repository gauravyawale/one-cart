import jwt from "jsonWebToken";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export const generateToken = (payload: Object, expiresIn = "7d"): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
