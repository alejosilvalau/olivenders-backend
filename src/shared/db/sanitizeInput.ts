import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodIssue } from 'zod';

export function sanitizeInput(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedInput = schema.parse(req.body);
      req.body.sanitizedInput = { ...validatedInput };
      next();
    } catch (error: any) {
      const formattedError = error.errors.map((err: ZodIssue) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      res.status(400).json({ errors: formattedError });
    }
  };
}
