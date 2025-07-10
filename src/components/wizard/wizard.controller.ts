import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';
import { Wizard, WizardRole } from './wizard.entity.js';
import { objectIdSchema } from '../../shared/db/objectIdSchema.js';
import { z } from 'zod';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sanitizeWizardResponse, sanitizeWizardResponseArray } from '../../shared/entities/sanitizeWizardResponse.js';
import { sanitizeInput } from '../../shared/db/sanitizeInput.js';

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
  school: objectIdSchema,
});

const sanitizeWizardInput = sanitizeInput(wizardZodSchema);

const sanitizeWizardPartialInput = sanitizeInput(wizardZodSchema.partial());


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

    input.role = WizardRole.User;
    input.deactivated = false;

    const wizard = em.create(Wizard, input);
    await em.flush();

    const sanitizedResponse = sanitizeWizardResponse(wizard);
    res.status(201).json({ message: 'Wizard created', data: sanitizedResponse });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({
        message: 'A wizard with this username or email already exists',
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

async function makeAdmin(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wizard = await em.findOneOrFail(Wizard, { id });

    if (wizard.role === WizardRole.Admin) {
      res.status(400).json({ message: 'Wizard is already an admin' });
      return;
    }

    wizard.role = WizardRole.Admin;
    await em.persistAndFlush(wizard);

    const sanitizedResponse = sanitizeWizardResponse(wizard);
    res.status(200).json({ message: 'Wizard role updated to admin', data: sanitizedResponse });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wizard not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function makeUser(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wizard = await em.findOneOrFail(Wizard, { id });

    if (wizard.role === WizardRole.User) {
      res.status(400).json({ message: 'Wizard is already a user' });
      return;
    }

    wizard.role = WizardRole.User;
    await em.persistAndFlush(wizard);

    const sanitizedResponse = sanitizeWizardResponse(wizard);
    res.status(200).json({ message: 'Wizard role updated to user', data: sanitizedResponse });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wizard not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function deactivate(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wizardToUpdate = await em.findOneOrFail(Wizard, { id });
    wizardToUpdate.deactivated = true;
    await em.flush();

    const sanitizedResponse = sanitizeWizardResponse(wizardToUpdate);
    res.status(200).json({ message: 'Wizard account deactivated', data: sanitizedResponse });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wizard not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function activate(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wizardToUpdate = await em.findOneOrFail(Wizard, { id });
    wizardToUpdate.deactivated = false;
    await em.flush();

    const sanitizedResponse = sanitizeWizardResponse(wizardToUpdate);
    res.status(200).json({ message: 'Wizard account activated', data: sanitizedResponse });
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
    const wizardToDelete = await em.findOneOrFail(Wizard, { id }, { populate: ['orders', 'answers'] });
    await em.removeAndFlush(wizardToDelete);
    res.status(200).json({ message: 'Wizard deleted' });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wizard not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
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
  makeAdmin,
  makeUser,
  deactivate,
  activate,
  remove,
};
