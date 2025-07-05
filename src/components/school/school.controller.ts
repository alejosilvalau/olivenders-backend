import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';
import { School } from './school.entity.js';
import { z } from 'zod';
import { objectIdSchema } from '../../shared/db/objectIdSchema.js';

const schoolZodSchema = z.object({
  id: objectIdSchema.optional(),
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  address: z.string().trim().min(1),
  phone: z.string().trim().min(1),
});

const em = orm.em;

const sanitizeSchoolInput = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const validatedInput = schoolZodSchema.parse(req.body);
    req.body.sanitizedInput = { ...validatedInput };
    next();
  } catch (error: any) {
    const formattedError = error.errors.map((err: z.ZodIssue) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    res.status(400).json({ errors: formattedError });
  }
};

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const schools = await em.find(School, {});
    res.status(200).json({ message: 'schools fetched', data: schools });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const school = await em.findOneOrFail(School, { id });
    if (!school) {
      res.status(404).json({ message: 'school not found', data: null });
      return;
    }
    res.status(200).json({ message: 'school fetched', data: school });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOneByName(req: Request, res: Response) {
  try {
    const name = req.params.name.toLowerCase();
    const school = await em.findOneOrFail(School, { name });
    if (!school) {
      res.status(404).json({ message: 'school not found', data: null });
      return;
    }
    res.status(200).json({ message: 'school fetched', data: school });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();
    input.email = input.email.toLowerCase();
    input.wizards = [];

    const school = em.create(School, input);
    await em.flush();
    res.status(201).json({ message: 'school created', data: school });
  } catch (error: any) {
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      res.status(409).json({
        message: 'a school with this name already exists',
        data: null,
      });
    } else {
      res.status(500).json({
        message: 'an error occurred while creating the school',
        data: null,
      });
    }
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();
    input.email = input.email.toLowerCase();

    const schoolToUpdate = await em.findOneOrFail(School, { id });
    em.assign(schoolToUpdate, input);
    await em.flush();
    res.status(200).json({ message: 'school updated', data: schoolToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const schoolToDelete = await em.findOneOrFail(School, { id }, { populate: ['wizards'] });
    await em.removeAndFlush(schoolToDelete);
    res.status(200).json({ message: 'school deleted', data: null });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

export { sanitizeSchoolInput, findAll, findOne, findOneByName, add, update, remove };
