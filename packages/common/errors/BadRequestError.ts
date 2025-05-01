import { AppError } from './AppError';

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request', isOperational = true) {
    super(message, 400, isOperational);
  }
}
