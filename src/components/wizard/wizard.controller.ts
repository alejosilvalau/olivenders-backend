import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';
import { Wizard } from './wizard.entity.js';
import { objectIdSchema } from '../../shared/db/objectIdSchema.js';
import { z } from 'zod';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { wrap } from '@mikro-orm/core';

dotenv.config();
const em = orm.em;

const wizardZodSchema = z.object({
  id: objectIdSchema.optional(),
  username: z.string(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .refine(val => /[A-Z]/.test(val), { message: 'Password must contain at least one uppercase letter' })
    .refine(val => /[0-9]/.test(val), { message: 'Password must contain at least one number' })
    .refine(val => /[^A-Za-z0-9]/.test(val), { message: 'Password must contain at least one special character' }),
  name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  address: z.string(),
  phone: z.string(),
  role: z.enum(['ADMIN', 'WIZARD']),
  school: objectIdSchema,
});

function sanitizeWizardInput(req: Request, res: Response, next: NextFunction): void {
  try {
    const validatedInput = wizardZodSchema.parse(req.body);
    req.body.sanitizedInput = { ...validatedInput };
    next();
  } catch (error: any) {
    const formattedError = error.errors.map((err: z.ZodIssue) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    res.status(400).json({ errors: formattedError });
  }
}

const partialWizardZodSchema = wizardZodSchema.partial();

function sanitizeWizardPartialInput(req: Request, res: Response, next: NextFunction): void {
  try {
    const validatedInput = partialWizardZodSchema.parse(req.body);
    req.body.sanitizedInput = { ...validatedInput };
    next();
  } catch (error: any) {
    const formattedError = error.errors.map((err: z.ZodIssue) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    res.status(400).json({ errors: formattedError });
  }
}

function sanitizeWizardResponse(wizard: Wizard | null) {
  if (!wizard) return wizard;
  const obj = wrap(wizard).toObject() as any;
  delete obj.password;
  return obj;
}

function sanitizeWizardResponseArray(wizards: Wizard[]) {
  return wizards.map(sanitizeWizardResponse);
}

async function findAll(req: Request, res: Response) {
  try {
    const wizards = await em.find(Wizard, {}, { populate: ['school'] });
    const sanitizedResponseArray = sanitizeWizardResponseArray(wizards);
    res.status(200).json({ message: 'Wizards fetched', data: sanitizedResponseArray });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wizard = await em.findOneOrFail(Wizard, { id }, { populate: ['school'] });
    const sanitizedResponse = sanitizeWizardResponse(wizard);
    res.status(200).json({ message: 'Wizard fetched', data: sanitizedResponse });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wizard not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function findOneByEmail(req: Request, res: Response) {
  try {
    const email = req.params.email;
    const wizard = await em.findOneOrFail(Wizard, { email }, { populate: ['school'] });
    const sanitizedResponse = sanitizeWizardResponse(wizard);
    res.status(200).json({ message: 'Wizard fetched', data: sanitizedResponse });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wizard not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function findOneByUsername(req: Request, res: Response) {
  try {
    const username = req.params.username;
    const wizard = await em.findOneOrFail(Wizard, { username }, { populate: ['school'] });
    const sanitizedResponse = sanitizeWizardResponse(wizard);
    res.status(200).json({ message: 'Wizard fetched', data: sanitizedResponse });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wizard not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function isUsernameAvailable(req: Request, res: Response) {
  try {
    const username = req.params.username;
    const wizardFound = await em.findOne(Wizard, { username });
    if (wizardFound) {
      res.status(200).json({ message: 'Username already exists', data: false });
      return;
    }
    res.status(200).json({ message: 'Username available', data: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function isEmailAvailable(req: Request, res: Response) {
  try {
    const email = req.params.email;
    const wizardFound = await em.findOne(Wizard, { email });
    if (wizardFound) {
      res.status(200).json({ message: 'Email already exists', data: false });
      return;
    }
    res.status(200).json({ message: 'Email available', data: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();
    input.email = input.email.toLowerCase();

    const hashRounds = 10;
    input.password = await bcrypt.hash(input.password, hashRounds);

    const wizard = em.create(Wizard, input);
    await em.flush();

    const sanitizedResponse = sanitizeWizardResponse(wizard);
    res.status(201).json({ message: 'Wizard created', data: sanitizedResponse });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({
        message: 'A wizard with this name or email already exists',
      });
    } else {
      res.status(500).json({ message: 'An error occurred while creating the wizard' });
    }
  }
}

async function login(req: Request, res: Response) {
  try {
    const username = req.body.username;
    const wizard = await em.findOneOrFail(Wizard, { username });

    const password = req.body.password;
    const isMatch = await bcrypt.compare(password, wizard.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Incorrect password' });
      return;
    }

    const token = jwt.sign({ id: wizard.id, role: wizard.role }, process.env.SECRET_KEY_WEBTOKEN!, {
      expiresIn: '1h',
    });

    const sanitizedResponse = sanitizeWizardResponse(wizard);
    res.status(200).json({ message: 'Login successful', data: { user: sanitizedResponse, token: token } });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wizard not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function validatePassword(req: Request, res: Response) {
  try {
    const wizardId = req.params.id;
    const wizard = await em.findOneOrFail(Wizard, { id: wizardId });

    const password = req.body.password;
    const isMatch = await bcrypt.compare(password, wizard.password);
    res.status(200).json({ message: 'Password validation completed', data: isMatch });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wizard not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();
    input.email = input.email.toLowerCase();

    const hashRounds = 10;
    input.password = await bcrypt.hash(input.password, hashRounds);

    const wizardToUpdate = await em.findOneOrFail(Wizard, { id });
    em.assign(wizardToUpdate, req.body.sanitizedInput);
    await em.flush();

    const sanitizedResponse = sanitizeWizardResponse(wizardToUpdate);
    res.status(200).json({ message: 'Wizard updated', data: sanitizedResponse });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function changePasswordWithoutToken(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wizard = await em.findOneOrFail(Wizard, { id });

    const newPassword = req.body.password;
    const hashRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, hashRounds);
    wizard.password = hashedPassword;
    await em.persistAndFlush(wizard);

    const sanitizedResponse = sanitizeWizardResponse(wizard);
    res.status(200).json({ message: 'Password updated successfully', data: sanitizedResponse });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wizard not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wizardToDelete = await em.findOneOrFail(Wizard, { id });
    await em.removeAndFlush(wizardToDelete);
    res.status(200).json({ message: 'Wizard deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export {
  sanitizeWizardInput,
  sanitizeWizardPartialInput,
  findAll,
  findOne,
  findOneByEmail,
  findOneByUsername,
  isUsernameAvailable,
  isEmailAvailable,
  add,
  login,
  validatePassword,
  update,
  changePasswordWithoutToken,
  remove,
};
