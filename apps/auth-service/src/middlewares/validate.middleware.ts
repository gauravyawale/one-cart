import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema<any>): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): any => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      return res.status(400).json({ error: err.errors.map((e: any) => e.message) });
    }
  };
