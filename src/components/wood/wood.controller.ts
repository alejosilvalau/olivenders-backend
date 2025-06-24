import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/orm.js';
import { z } from 'zod';
import { Wood } from './wood.entity.js';

const woodZodSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1),
  binomial_name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.number()
});

const em = orm.em;

const sanitizeWoodInput = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const validatedInput = woodZodSchema.parse(req.body);

    req.body.sanitizedInput = {
      id: validatedInput.id,
      name: validatedInput.name,
      binomial_name: validatedInput.binomial_name,
      description: validatedInput.description,
      price: validatedInput.price
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
    const woods = await em.find(Wood, {});
    res.status(200).json({ message: 'Woods fetched', data: woods });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id;
    const wood = await em.findOne(Wood, { id });
    if (!wood) {
      res.status(404).json({ message: 'Wood not found', data: null });
      return;
    }
    res.status(200).json({ message: 'Wood fetched', data: wood });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function add(req: Request, res: Response): Promise<void> {
  try {
    const input = req.body.sanitizedInput;
    input.name = input.name.toUpperCase();

    const existingWood = await em.findOne(Wood, { name: input.name
  
    });
    if (existingWood) {
      res.status(409).json({ message: 'The Wood already exists', data: null });
    } else {
      const wood = em.create(Wood, input);
      
      await em.flush();
      res.status(201).json({ message: 'Wood created', data: wood });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while creating the Wood', data: null });
  }
}

async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const input = req.body.sanitizedInput;
    input.name = input.name.toUpperCase();

    const woodToUpdate = await em.findOne(Wood, { id });
    if (!woodToUpdate) {
      res.status(404).json({ message: 'Wood not found', data: null });
    } else {
      em.assign(woodToUpdate, input);
      await em.flush();
      res.status(200).json({ message: 'Wood updated', data: woodToUpdate });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const woodToDelete = await em.findOne(Wood, { id });
    if (!woodToDelete) {
      res.status(404).json({ message: 'Wood not found', data: null });
    } else {
      await em.removeAndFlush(woodToDelete!);
      res.status(200).json({ message: 'Wood deleted', data: null });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOneByName(req: Request, res: Response): Promise<void> {
  try {
    const name = req.params.name.toUpperCase();
    const excludeWoodId = req.query.excludeWoodId;

    const query: any = {};

    if (name) {
      query.name = name;
    }
    if (excludeWoodId) {
      query.id = { $ne: excludeWoodId };
    }
    const wood = await em.findOne(Wood, query);

    if (!Wood) {
      res.status(200).json({ message: 'Wood not found', data: null });
      return;
    }

    res.status(200).json({ message: 'Wood fetched', data: Wood });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

export { sanitizeWoodInput, findAll, findOne, add, update, remove, findOneByName };