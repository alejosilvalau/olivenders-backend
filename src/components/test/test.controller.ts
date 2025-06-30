import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/orm.js';
import { z } from 'zod';
import { Test } from './test.entity.js';

const testZodSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1),
  date: z.date().or(z.string().datetime()),
});

const em = orm.em;

const sanitizeTestInput = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Parse date string to Date object if it's a string
    if (req.body.date && typeof req.body.date === 'string') {
      req.body.date = new Date(req.body.date);
    }

    const validatedInput = testZodSchema.parse(req.body);

    req.body.sanitizedInput = {
      id: validatedInput.id,
      name: validatedInput.name,
      date: validatedInput.date,
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
    em.clear();
    const tests = await em.find(Test, {});
    res.status(200).json({ message: 'Tests fetched', data: tests });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id;
    const test = await em.findOne(Test, { id });
    if (!test) {
      res.status(404).json({ message: 'Test not found', data: null });
      return;
    }
    res.status(200).json({ message: 'Test fetched', data: test });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOneById(id: string) {
  try {
    const test = await em.findOne(Test, { id });
    return test;
  } catch (error: any) {
    return error.message;
  }
}

async function add(req: Request, res: Response): Promise<void> {
  try {
    const input = req.body.sanitizedInput;
    input.name = input.name.toUpperCase();

    const existingTest = await em.findOne(Test, {
      id: input.id,
    });

    if (existingTest) {
      res.status(409).json({ message: 'The test already exists', data: null });
    } else {
      const test = em.create(Test, input);
      await em.flush();
      res.status(201).json({ message: 'Test created', data: test });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while creating the test', data: null });
  }
}

async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const input = req.body.sanitizedInput;

    // Convert name to uppercase if it's provided
    if (input.name) {
      input.name = input.name.toUpperCase();
    }

    const testToUpdate = await em.findOne(Test, { id });
    if (!testToUpdate) {
      res.status(404).json({ message: 'Test not found', data: null });
      return;
    }

    em.assign(testToUpdate, input);
    await em.flush();
    res.status(200).json({ message: 'Test updated', data: testToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const testToDelete = await em.findOne(Test, { id });
    if (!testToDelete) {
      res.status(404).json({ message: 'Test not found', data: null });
      return;
    }

    await em.removeAndFlush(testToDelete);
    res.status(200).json({ message: 'Test deleted', data: null });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

export { sanitizeTestInput, findAll, findOne, findOneById, add, update, remove };
