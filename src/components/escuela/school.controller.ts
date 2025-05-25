import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/orm.js';
import { School } from './school.entity.js';
import { z } from 'zod';

const schoolZodSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  address: z.string().trim().min(1),
  phone: z.string().trim().min(1),
});

const em = orm.em;

const sanitizeSchoolInput = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const validatedInput = schoolZodSchema.parse(req.body);

    req.body.sanitizedInput = {
      id: validatedInput.id,
      name: validatedInput.name,
      email: validatedInput.email,
      address: validatedInput.address,
      phone: validatedInput.phone,
    };

    Object.keys(req.body.sanitizedInput).forEach(key => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    next();
  } catch (error: any) {
    const formattedError = error.errors.map((err: z.ZodIssue) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    res.status(400).json({ errors: formattedError });
  }
};

async function findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const schools = await em.find(School, {});
    res.status(200).json({ message: 'Schools fetched', data: schools });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id;
    const school = await em.findOne(School, { id });
    if (!school) {
      res.status(404).json({ message: 'School not found', data: null });
      return;
    }
    res.status(200).json({ message: 'School fetched', data: school });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOneByName(req: Request, res: Response): Promise<void> {
  try {
    const name = req.params.name.toUpperCase();
    const excludeSchoolId = req.query.excludeSchoolId;

    const query: any = {};

    if (name) {
      query.name = name;
    }
    if (excludeSchoolId) {
      query.id = { $ne: excludeSchoolId };
    }
    const school = await em.findOne(School, query);

    if (!school) {
      res.status(200).json({ message: 'School not found', data: null });
      return;
    }

    res.status(200).json({ message: 'School fetched', data: school });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function add(req: Request, res: Response): Promise<void> {
  try {
    const input = req.body.sanitizedInput;
    input.name = input.name.toUpperCase();

    const existingSchool = await em.findOne(School, {
      email: input.email,
    });
    if (existingSchool) {
      res.status(409).json({ message: 'The school already exists', data: null });
    } else {
      const school = em.create(School, input);
      await em.flush();
      res.status(201).json({ message: 'School created', data: school });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while creating the school', data: null });
  }
}

async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const input = req.body.sanitizedInput;
    input.name = input.name.toUpperCase();

    const schoolToUpdate = await em.findOne(School, { id });
    if (!schoolToUpdate) {
      res.status(404).json({ message: 'School not found', data: null });
    } else {
      em.assign(schoolToUpdate, input);
      await em.flush();
      res.status(200).json({ message: 'School updated', data: schoolToUpdate });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const schoolToDelete = await em.findOne(School, { id });
    if (!schoolToDelete) {
      res.status(404).json({ message: 'School not found', data: null });
    } else {
      await em.removeAndFlush(schoolToDelete!);
      res.status(200).json({ message: 'School deleted', data: null });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

export { findAll, findOne, findOneByName, add, update, remove, sanitizeSchoolInput };
