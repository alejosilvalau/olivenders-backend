import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/orm.js';
import { Mage } from './mage.entity.js';
import { z } from 'zod';

const mageZodSchema = z.object({});
