export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public stack?: string;

  constructor(message: string, statusCode: number = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.stack = new Error().stack;

    Error.captureStackTrace(this, this.constructor);
  }
}
