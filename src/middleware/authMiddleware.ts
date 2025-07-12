import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { WizardRole } from '../components/wizard/wizard.entity.js';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY_WEBTOKEN as string;

interface Wizard {
  id: string;
  role: WizardRole;
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ message: 'Access denied. Token not provided' });
    return;
  }

  try {
    const wizard = jwt.verify(token, SECRET_KEY) as Wizard | undefined;

    if (!wizard) {
      res.status(403).json({ message: 'Invalid token' });
      return;
    }

    (req as any).wizard = wizard;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
    return;
  }
}

export function verifyAdminRole(req: Request, res: Response, next: NextFunction) {
  const wizard = (req as any).wizard as Wizard;

  if (!wizard || wizard.role !== WizardRole.Admin) {
    res.status(403).json({ message: 'Access denied. You do not have sufficient permissions' });
    return;
  }
  next();
}
