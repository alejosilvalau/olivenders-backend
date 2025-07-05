import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';
import { Wizard } from './wizard.entity.js';
import { objectIdSchema } from '../../shared/db/objectIdSchema.js';
import { z } from 'zod';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();

const wizardZodSchema = z.object({
  id: objectIdSchema.optional(),
  username: z.string(),
  password: z
    .string()
    .min(6, 'password must be at least 6 characters')
    .refine(val => /[A-Z]/.test(val), { message: 'password must contain at least one uppercase letter' })
    .refine(val => /[0-9]/.test(val), { message: 'password must contain at least one number' })
    .refine(val => /[^A-Za-z0-9]/.test(val), { message: 'password must contain at least one special character' }),
  name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  address: z.string(),
  phone: z.string(),
  role: z.string(),
});

const partialWizardZodSchema = wizardZodSchema.partial();

const em = orm.em;

function sanitizeWizardInput(req: Request, res: Response, next: NextFunction): void {
  try {
    const schema = req.method === 'PATCH' ? partialWizardZodSchema : wizardZodSchema;
    const validatedInput = schema.parse(req.body);
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

async function findAll(req: Request, res: Response) {
  try {
    const wizards = await em.find(Wizard, {}, { populate: ['school'] });
    res.status(200).json({ message: 'wizards fetched', data: wizards });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wizard = await em.findOneOrFail(Wizard, { id }, { populate: ['school'] });
    res.status(200).json({ message: 'wizard fetched', data: wizard });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'wizard not found', data: null });
    } else {
      res.status(500).json({ message: error.message, data: null });
    }
  }
}

async function findOneByEmail(req: Request, res: Response) {
  try {
    const email = req.params.email;
    const wizard = await em.findOneOrFail(Wizard, { email }, { populate: ['school'] });
    res.status(200).json({ message: 'wizard fetched', data: wizard });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'wizard not found', data: null });
    } else {
      res.status(500).json({ message: error.message, data: null });
    }
  }
}

async function findOneByUsername(req: Request, res: Response) {
  try {
    const username = req.params.username;
    const wizard = await em.findOneOrFail(Wizard, { username }, { populate: ['school'] });
    res.status(200).json({ message: 'wizard fetched', data: wizard });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'wizard not found', data: null });
    } else {
      res.status(500).json({ message: error.message, data: null });
    }
  }
}

async function isUsernameAvailable(req: Request, res: Response) {
  try {
    const username = req.params.username;
    const wizardFound = await em.findOne(Wizard, { username });
    if (wizardFound) {
      res.status(200).json({ message: 'username already exists', data: false });
      return;
    }
    res.status(200).json({ message: 'username available', data: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function isEmailAvailable(req: Request, res: Response) {
  try {
    const email = req.params.email;
    const wizardFound = await em.findOne(Wizard, { email });
    if (wizardFound) {
      res.status(200).json({ message: 'email already exists', data: false });
      return;
    }
    res.status(200).json({ message: 'email available', data: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
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

    // Remove password from response for security
    const wizardData = { ...wizard, password: undefined };
    res.status(201).json({ message: 'wizard created', data: wizardData });
  } catch (error: any) {
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      res.status(409).json({
        message: 'a wizard with this name or email already exists',
        data: null,
      });
    } else {
      res.status(500).json({ message: 'an error occurred while creating the wizard', data: null });
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
      res.status(401).json({ message: 'incorrect password', data: null });
      return;
    }

    const token = jwt.sign({ id: wizard.id, role: wizard.role }, process.env.SECRET_KEY_WEBTOKEN!, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'login successful', data: { user: wizard, token: token } });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'wizard not found', data: null });
    } else {
      res.status(500).json({ message: error.message, data: null });
    }
  }
}

async function validatePassword(req: Request, res: Response) {
  try {
    const wizardId = req.params.id;
    const wizard = await em.findOneOrFail(Wizard, { id: wizardId });

    const password = req.body.password;
    const isMatch = await bcrypt.compare(password, wizard.password);
    res.status(200).json({ message: 'password validation completed', data: isMatch });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'wizard not found', data: null });
    } else {
      res.status(500).json({ message: error.message, data: null });
    }
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();
    input.email = input.email.toLowerCase();

    const wizardToUpdate = em.findOneOrFail(Wizard, id);
    em.assign(wizardToUpdate, req.body.sanitizedInput);
    await em.flush();

    // Remove password from response for security
    const wizardData = { ...wizardToUpdate, password: undefined };
    res.status(200).json({ message: 'wizard updated', data: wizardData });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function resetPasswordWithoutToken(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wizard = await em.findOneOrFail(Wizard, { id });

    const newPassword = req.body.newPassword;
    const hashRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, hashRounds);
    wizard.password = hashedPassword;
    await em.persistAndFlush(wizard);

    // Remove password from response for security
    const wizardData = { ...wizard, password: undefined };
    res.status(200).json({ message: 'password updated successfully', data: wizardData });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'wizard not found', data: null });
    } else {
      res.status(500).json({ message: error.message, data: null });
    }
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wizardToDelete = await em.findOneOrFail(Wizard, { id }, { populate: ['school'] });
    await em.removeAndFlush(wizardToDelete);
    res.status(200).json({ message: 'wizard deleted', data: null });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

export {
  sanitizeWizardInput,
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
  resetPasswordWithoutToken,
  remove,
};
