import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  // Handle known errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Handle unexpected errors
  console.error('Unexpected Error:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};
