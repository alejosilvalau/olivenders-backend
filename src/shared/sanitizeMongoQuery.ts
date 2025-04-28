import { NextFunction, Request, Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';

export const sanitizeMongoQuery = (req: Request, res: Response, next: NextFunction) => {
  req.query = mongoSanitize.sanitize(req.query);
  req.body = mongoSanitize.sanitize(req.body); // Apply to body as well if used in queries
  next();
};
