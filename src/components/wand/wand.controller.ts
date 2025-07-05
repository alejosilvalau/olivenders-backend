import { Request, Response, NextFunction } from 'express';
import { objectIdSchema } from '../../shared/db/objectIdSchema.js';
import { orm } from '../../shared/db/orm.js';
import { Wand } from './wand.entity.js';
import { z } from 'zod';

const wandZodSchema = z.object({
  id: objectIdSchema.optional(),
  name: z.string().trim().min(1),
  length: z.number().positive(),
  description: z.string().trim().min(1),
  status: z.string().trim().min(1),
  image: z.string().trim().min(1),
  profit_margin: z.number().nonnegative(),
  total_price: z.number().positive(),
  wood: objectIdSchema,
});

const em = orm.em;

function sanitizeWandInput(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedInput = wandZodSchema.parse(req.body);

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
    const wands = await em.find(Wand, {}, { populate: ['wood', 'core'] });
    res.status(200).json({ message: 'wands fetched', data: wands });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

// TODO: Implement the function when doing the relationships
// async function findAllByUser(req: Request, res: Response) {
//   try {
//     em.clear();
//     const email = req.params.id;
//     const wands = await em.find(Wand, { email });
//     res.status(200).json(wands);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wand = await em.findOneOrFail(Wand, { id }, { populate: ['wood', 'core'] });
    if (!wand) {
      res.status(404).json({ message: 'wand not found', data: null });
      return;
    }
    res.status(200).json({ message: 'wand fetched', data: wand });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

// TODO: Implement the function when doing the relationships
// async function findAllByCategory(req: Request, res: Response) {
//   try {
//     em.clear();
//     const status = req.params.id;
//     const wands = await em.find(Wand, { status });
//     res.status(200).json(wands);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();

    const wand = em.create(Wand, input);
    await em.flush();
    res.status(201).json({ message: 'wand created', data: wand });
  } catch (error: any) {
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      res.status(409).json({
        message: 'a wand with this name already exists',
        data: null,
      });
    } else {
      res.status(500).json({ message: 'an error occurred while creating the wand', data: null });
    }
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();

    const wandToUpdate = em.findOneOrFail(Wand, id);
    em.assign(wandToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'wand updated', data: wandToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}
async function logicRemove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wandToUpdate = await em.findOneOrFail(Wand, { id });
    em.assign(wandToUpdate, { status: 'inactive' });
    await em.flush();
    res.status(200).json({ message: 'wand deactivated', data: wandToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wandToDelete = await em.findOneOrFail(Wand, { id });
    await em.removeAndFlush(wandToDelete);
    em.clear();
    res.status(200).json({ message: 'wand deleted', data: null });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

export { sanitizeWandInput, findAll, findOne, add, update, remove, logicRemove };
