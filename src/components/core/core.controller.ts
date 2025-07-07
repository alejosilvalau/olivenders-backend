import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';
import { Core } from './core.entity.js';
import { z } from 'zod';
import { objectIdSchema } from '../../shared/db/objectIdSchema.js';

const em = orm.em;

const coreZodSchema = z.object({
  id: objectIdSchema.optional(),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.number().positive(),
});

const sanitizeCoreInput = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const validatedInput = coreZodSchema.parse(req.body);
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

async function findAll(req: Request, res: Response) {
  try {
    const cores = await em.find(Core, {});
    res.status(200).json({ message: 'Cores fetched', data: cores });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const core = await em.findOneOrFail(Core, { id });
    res.status(200).json({ message: 'Core fetched', data: core });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Core not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function findOneByName(req: Request, res: Response) {
  try {
    const name = req.params.name.toLowerCase();
    const core = await em.findOneOrFail(Core, { name });
    res.status(200).json({ message: 'Core fetched', data: core });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Core not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();
    input.wands = [];

    const core = em.create(Core, input);
    await em.flush();

    res.status(201).json({ message: 'Core created', data: core });
  } catch (error: any) {
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      res.status(409).json({
        message: 'A core with this name already exists',
      });
    } else {
      res.status(500).json({
        message: 'An error occurred while creating the core',
      });
    }
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();

    const coreToUpdate = await em.findOneOrFail(Core, { id });
    em.assign(coreToUpdate, input);
    await em.flush();

    res.status(200).json({ message: 'Core updated', data: coreToUpdate });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Core not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const coreToDelete = await em.findOneOrFail(Core, { id }, { populate: ['wands', 'wands.order'] });
    await em.removeAndFlush(coreToDelete);

    res.status(200).json({ message: 'Core deleted' });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Core not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

export { sanitizeCoreInput, findAll, findOne, findOneByName, add, update, remove };
