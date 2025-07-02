import { NextFunction, Request, Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';

export const sanitizeMongoQuery = (req: Request, res: Response, next: NextFunction) => {
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      const value = req.query[key];
      if (typeof value === 'string' || Array.isArray(value)) {
        req.query[key] =
          typeof value === 'string'
            ? mongoSanitize.sanitize({ value }).value
            : (mongoSanitize.sanitize(value) as string[]);
      }
    });
  }

  if (req.body) {
    Object.keys(req.body).forEach(key => {
      const value = req.body[key];
      if (typeof value === 'string' || typeof value === 'object') {
        req.body[key] = mongoSanitize.sanitize(value);
      }
    });
  }

  next();
};
