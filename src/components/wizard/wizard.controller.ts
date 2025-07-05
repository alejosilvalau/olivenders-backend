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
  password: z.string(),
  name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  address: z.string(),
  phone: z.string(),
  role: z.string(),
});

const em = orm.em;

function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction): void {
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

async function findAll(req: Request, res: Response): Promise<void> {
  try {
    const wizards = await em.find(Wizard, {}, { populate: ['school'] });
    res.status(200).json({ message: 'wizards fetched', data: wizards });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

// TODO: Refactor this function
async function findOneByEmailOrUsername(req: Request, res: Response): Promise<void> {
  try {
    const { username, email } = req.params;
    const excludeWizardId = req.query.excludeWizardId;

    const query: any = { $or: [] };

    if (username) query.$or.push({ username });
    if (email) query.$or.push({ email });
    if (excludeWizardId) query.id = { $ne: excludeWizardId };

    const wizardFound = await em.findOne(Wizard, query);

    if (!wizardFound) {
      res.status(200).json({ message: 'Wizard not found', data: null });
      return;
    }

    res.status(200).json({ message: 'Wizard found', data: wizardFound });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

// TODO: Refactor this function
async function findOneByEmailRecipient(req: Request, res: Response): Promise<void> {
  try {
    const email = req.params.email;
    const wizardFound = await em.findOneOrFail(Wizard, { email });
    if (!wizardFound) {
      res.status(409).json({ message: 'Wizard not found', data: null });
      return;
    }
    res.status(200).json({ message: 'Wizard found', data: wizardFound });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

// TODO: Refactor this function
async function findOneByEmail(email: string): Promise<any> {
  try {
    const wizard = await em.findOne(Wizard, { email });
    return wizard;
  } catch (error: any) {
    return error.message;
  }
}

// TODO: Refactor this function
async function findOneByUser(req: Request, res: Response): Promise<void> {
  try {
    const username = req.params.username;
    const wizard = await em.findOne(Wizard, { username });
    if (!wizard) {
      res.status(404).json({ message: 'Wizard not found', data: null });
      return;
    }
    res.status(200).json({ message: 'Wizard found', data: wizard });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOneById(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const wizard = await em.findOneOrFail(Wizard, { id });
    if (!wizard) {
      res.status(404).json({ message: 'Wizard not found', data: null });
      return;
    }
    res.status(200).json({ message: 'Wizard found', data: wizard });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

// TODO: Refactor this function
async function login(req: Request, res: Response): Promise<void> {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const wizardFound = await em.findOne(Wizard, { username });

    if (!wizardFound) {
      res.status(404).json({ message: 'Wizard not found', data: null });
      return;
    }

    const isMatch = await bcrypt.compare(password, wizardFound.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Incorrect password', data: null });
      return;
    }

    const token = jwt.sign({ id: wizardFound.id, role: wizardFound.role }, process.env.SECRET_KEY_WEBTOKEN!, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', data: { user: wizardFound, token: token } });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

// TODO: Refactor this function
async function validatePassword(req: Request, res: Response): Promise<void> {
  try {
    const wizardId = req.params.id;
    const currentPassword = req.body.password;
    const wizard = await em.findOne(Wizard, { id: wizardId });
    if (!wizard) {
      res.status(404).json({ message: 'Wizard not found', data: null });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, wizard.password);
    res.status(200).json({ message: 'Password validation completed', data: isMatch });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

// TODO: Refactor this function
async function checkUsername(req: Request, res: Response): Promise<void> {
  try {
    const username = req.params.username;
    const wizardFound = await em.findOne(Wizard, { username });
    if (!wizardFound) {
      res.status(200).json({ message: 'Username available', data: false });
      return;
    }
    res.status(200).json({ message: 'Username already exists', data: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

// TODO: Refactor this function
async function checkEmail(req: Request, res: Response): Promise<void> {
  try {
    const email = req.params.email;
    const wizardFound = await em.findOne(Wizard, { email });
    if (!wizardFound) {
      res.status(200).json({ message: 'Email available', data: false });
      return;
    }
    res.status(200).json({ message: 'Email already exists', data: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();
    input.email = input.email.toLowerCase();

    const wizard = em.create(Wizard, input);
    await em.flush();
    res.status(201).json({ message: 'wizard created', data: wizard });
  } catch (error: any) {
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      res.status(409).json({
        message: 'a wizard with this name already exists',
        data: null,
      });
    } else {
      res.status(500).json({ message: 'an error occurred while creating the wizard', data: null });
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
    res.status(200).json({ message: 'wizard updated', data: wizardToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

// TODO: Refactor this function
async function resetPasswordWithoutToken(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const newPassword = req.body.newPassword;

    if (newPassword.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters', data: null });
      return;
    }

    const wizard = await em.findOne(Wizard, { id });
    if (!wizard) {
      res.status(404).json({ message: 'Wizard not found', data: null });
      return;
    }

    const hashRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, hashRounds);
    wizard.password = hashedPassword;
    await em.persistAndFlush(wizard);

    // Remove password from response for security
    const wizardData = { ...wizard, password: undefined };
    res.status(200).json({ message: 'password updated successfully', data: wizardData });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wizardToDelete = await em.findOneOrFail(Wizard, { id });
    await em.removeAndFlush(wizardToDelete);
    em.clear();
    res.status(200).json({ message: 'wizard deleted', data: null });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

export {
  sanitizeUsuarioInput,
  findAll,
  findOneByEmailOrUsername,
  findOneByEmailRecipient,
  findOneByUser,
  findOneById,
  login,
  validatePassword,
  checkUsername,
  checkEmail,
  add,
  update,
  resetPasswordWithoutToken,
  remove,
};
