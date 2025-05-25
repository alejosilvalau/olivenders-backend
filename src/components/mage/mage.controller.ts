import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/orm.js';
import { Mage } from './mage.entity.js';
import { z } from 'zod';

const mageZodSchema = z.object({
  id: z.string().uuid().optional(),
  username: z.string(),
  password: z.string(),
  name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  address: z.string(),
  phone: z.string(),
  role: z.string(),
  school: z.string().uuid(),
});
