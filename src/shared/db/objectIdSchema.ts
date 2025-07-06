import { z } from 'zod';
import { ObjectId } from '@mikro-orm/mongodb';

// Custom validator for ObjectId
export const objectIdSchema = z.string().refine(
  val => {
    try {
      return ObjectId.isValid(val);
    } catch {
      return false;
    }
  },
  {
    message: 'Invalid objectid format',
  }
);
