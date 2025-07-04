import { NextFunction, Request, Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';

export const sanitizeMongoQuery = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      const value = req.query[key];
      if (typeof value === 'string') {
        req.query[key] = mongoSanitize.sanitize({ value }).value;
      } else if (Array.isArray(value)) {
        req.query[key] = mongoSanitize.sanitize(value);
      }
    });
  }

  // Sanitize request body
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body);
  }

  // Sanitize route parameters
  if (req.params) {
    req.params = mongoSanitize.sanitize(req.params);
  }

  next();
};
