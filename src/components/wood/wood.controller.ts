import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/orm.js';
import { z } from 'zod';
import { Wood } from './wood.entity.js';

const woodZodSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1),
  binomial_name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.number().min(1)
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
    const Woods = await em.find(Wood, {});
    res.status(200).json({ message: 'Woods fetched', data: Woods });
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
    res.status(200).json({ message: 'Wood fetched', data: Wood });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function add(req: Request, res: Response): Promise<void> {
  try {
    const input = req.body.sanitizedInput;
    input.name = input.name.toUpperCase();

    const existingWood = await em.findOne(Wood, {
  
    });
    if (existingWood) {
      res.status(409).json({ message: 'The Wood already exists', data: null });
    } else {
      const wood = em.create(Wood, input);
      await em.flush();
      res.status(201).json({ message: 'Wood created', data: Wood });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while creating the Wood', data: null });
  }
}

