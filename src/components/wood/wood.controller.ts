import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';
import { z } from 'zod';
import Wood from './wood.entity.js';
import { objectIdSchema } from '../../shared/db/objectIdSchema.js';

const em = orm.em;

const woodZodSchema = z.object({
  id: objectIdSchema.optional(),
  name: z.string().trim().min(1),
  binomial_name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.number(),
});

const sanitizeWoodInput = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const validatedInput = woodZodSchema.parse(req.body);
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
    const woods = await em.find(Wood, {});
    res.status(200).json({ message: 'Woods fetched', data: woods });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const wood = await em.findOneOrFail(Wood, { id });
    res.status(200).json({ message: 'Wood fetched', data: wood });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wood not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function findOneByName(req: Request, res: Response) {
  try {
    const name = req.params.name.toLowerCase();
    const wood = await em.findOneOrFail(Wood, { name });
    res.status(200).json({ message: 'Wood fetched', data: wood });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wood not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();
    input.binomial_name = input.binomial_name.toLowerCase();
    input.wands = [];

    const wood = em.create(Wood, input);
    await em.flush();
    res.status(201).json({ message: 'Wood created', data: wood });
  } catch (error: any) {
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      res.status(409).json({
        message: 'A wood with this name already exists',
      });
    } else {
      res.status(500).json({
        message: 'An error occurred while creating the wood',
      });
    }
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();
    input.binomial_name = input.binomial_name.toLowerCase();

    const woodToUpdate = await em.findOneOrFail(Wood, { id });
    em.assign(woodToUpdate, input);
    await em.flush();
    res.status(200).json({ message: 'Wood updated', data: woodToUpdate });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wood not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const woodToDelete = await em.findOneOrFail(Wood, { id }, { populate: ['wands'] });
    await em.removeAndFlush(woodToDelete);
    res.status(200).json({ message: 'Wood deleted' });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wood not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

export { sanitizeWoodInput, findAll, findOne, findOneByName, add, update, remove };