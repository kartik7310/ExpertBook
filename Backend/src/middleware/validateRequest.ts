import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import AppError from '../utils/AppError';

const validate = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error: any) {
    if (error instanceof ZodError) {
      const message = error.issues.map((i: { message: string }) => i.message).join(', ');
      return next(new AppError(message, 400));
    }
    next(error);
  }
};

export default validate;
