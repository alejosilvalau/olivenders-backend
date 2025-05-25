import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/orm.js';
import { Mage } from './mage.entity.js';
import { z } from 'zod';

const mageZodSchema = z.object({

  id: z.string().uuid().optional(),
  user: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "La clave debe tener al menos 6 caracteres"),
  name: z.string(),
  surname: z.string(),
  email: z.string().email("Debe ser un email válido"),
  address: z.string(),
  phone: z.string(),
});

