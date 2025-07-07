import { Request, Response, NextFunction } from 'express';
import { objectIdSchema } from '../../shared/db/objectIdSchema.js';
import { orm } from '../../shared/db/orm.js';
import { Wand, WandStatus } from './wand.entity.js';
import { z } from 'zod';
import Wood from '../wood/wood.entity.js';
import { Core } from '../core/core.entity.js';

const em = orm.em;

const wandZodSchema = z.object({
  id: objectIdSchema.optional(),
  name: z.string().trim().min(1),
  length_inches: z.number().positive(),
  description: z.string().trim().min(1),
  image: z.string().trim().min(1),
  profit: z.number().nonnegative(),
  wood: objectIdSchema,
  core: objectIdSchema,
});

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

async function calculateWandPrice(woodId: string, coreId: string, profit: number) {
  try {
    const wood = await em.findOneOrFail(Wood, { id: woodId });
    const core = await em.findOneOrFail(Core, { id: coreId });

    const totalPrice = wood.price + core.price + profit;
    return totalPrice;
  } catch (error: any) {
    throw new Error(`Failed to calculate wand price: ${error.message}`);
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const wands = await em.find(Wand, {}, { populate: ['wood', 'core'] });
    res.status(200).json({ message: 'Wands fetched', data: wands });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findAllByCore(req: Request, res: Response) {
  try {
    const coreId = req.params.coreId;
    const wands = await em.find(Wand, { core: coreId, status: WandStatus.Available }, { populate: ['wood', 'core'] });
    res.status(200).json({ message: 'Wands fetched', data: wands });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findAllByWood(req: Request, res: Response) {
  try {
    const woodId = req.params.woodId;
    const wands = await em.find(Wand, { wood: woodId, status: WandStatus.Available }, { populate: ['wood', 'core'] });
    res.status(200).json({ message: 'Wands fetched', data: wands });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wand = await em.findOneOrFail(Wand, { id }, { populate: ['wood', 'core'] });
    res.status(200).json({ message: 'Wand fetched', data: wand });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wand not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();

    input.status = WandStatus.Available; 

    input.total_price = await calculateWandPrice(input.wood, input.core, input.profit);

    const wand = em.create(Wand, input);
    await em.flush();
    res.status(201).json({ message: 'Wand created', data: wand });
  } catch (error: any) {
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      res.status(409).json({ message: 'A wand with this name already exists' });
    } else {
      res.status(500).json({ message: 'An error occurred while creating the wand' });
    }
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();

    input.total_price = await calculateWandPrice(input.wood, input.core, input.profit);

    const wandToUpdate = await em.findOneOrFail(Wand, id);
    em.assign(wandToUpdate, input);
    await em.flush();
    res.status(200).json({ message: 'Wand updated', data: wandToUpdate });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wand not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function markAsAvailable(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wandToUpdate = await em.findOneOrFail(Wand, { id });
    em.assign(wandToUpdate, { status: WandStatus.Available });
    await em.flush();
    res.status(200).json({ message: 'Wand available', data: wandToUpdate });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wand not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function markAsSold(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wandToUpdate = await em.findOneOrFail(Wand, { id });
    em.assign(wandToUpdate, { status: WandStatus.Sold });
    await em.flush();
    res.status(200).json({ message: 'Wand sold', data: wandToUpdate });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wand not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function deactivate(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wandToUpdate = await em.findOneOrFail(Wand, { id });
    em.assign(wandToUpdate, { status: WandStatus.Deactivated });
    await em.flush();
    res.status(200).json({ message: 'Wand deactivated', data: wandToUpdate });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wand not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wandToDelete = await em.findOneOrFail(Wand, { id }, { populate: ['order'] });
    await em.removeAndFlush(wandToDelete);
    em.clear();
    res.status(200).json({ message: 'Wand deleted' });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Wand not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

export {
  sanitizeWandInput,
  findAll,
  findAllByCore,
  findAllByWood,
  findOne,
  add,
  update,
  markAsAvailable,
  markAsSold,
  deactivate,
  remove,
};
