import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/orm.js';
import { Core } from './core.entity.js';
import { z } from 'zod';

const coreZodSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.number().positive(),
});

const em = orm.em;

const sanitizeCoreInput = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const validatedInput = coreZodSchema.parse(req.body);

    req.body.sanitizedInput = {
      id: validatedInput.id,
      name: validatedInput.name,
      description: validatedInput.description,
      price: validatedInput.price,
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

async function findAll(req: Request, res: Response): Promise<void> {
  try {
    const cores = await em.find(Core, {});
    res.status(200).json({ message: 'Cores fetched', data: cores });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOne(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const core = await em.findOne(Core, { id });
    if (!core) {
      res.status(404).json({ message: 'Core not found', data: null });
      return;
    }
    res.status(200).json({ message: 'Core fetched', data: core });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function add(req: Request, res: Response): Promise<void> {
  try {
    const input = req.body.sanitizedInput;
    input.name = input.name.toUpperCase();

    const existingCore = await em.findOne(Core, { name: input.name });
    if (existingCore) {
      res.status(409).json({ message: 'The core already exists', data: null });
    } else {
      const core = em.create(Core, input);
      await em.flush();
      res.status(201).json({ message: 'Core created', data: core });
    }
  } catch (error: any) {
    console.error('Error creating core:', error);
    res.status(500).json({ message: 'An error occurred while creating the core', data: null });
  }
}

  async function update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const input = req.body.sanitizedInput;
      input.name = input.name.toUpperCase();

      const coreToUpdate = await em.findOne(Core, { id });
      if (!coreToUpdate) {
        res.status(404).json({ message: 'Core not found', data: null });
      } else {
        em.assign(coreToUpdate, input);
        await em.flush();
        res.status(200).json({ message: 'Core updated', data: coreToUpdate });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message, data: null });
    }
  }

  async function remove(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const coreToDelete = await em.findOne(Core, { id });
      if (!coreToDelete) {
        res.status(404).json({ message: 'Core not found', data: null });
      } else {
        await em.removeAndFlush(coreToDelete!);
        res.status(200).json({ message: 'Core deleted', data: null });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message, data: null });
    }
  }

  async function findOneByName(req: Request, res: Response): Promise<void> {
    try {
      const name = req.params.name.toUpperCase();
      const excludeCoreId = req.query.excludeCoreId;

      const query: any = {};
      if (name) query.name = name;
      if (excludeCoreId) query.id = { $ne: excludeCoreId };

      const core = await em.findOne(Core, query);

      if (!core) {
        res.status(200).json({ message: 'Core not found', data: null });
        return;
      }

      res.status(200).json({ message: 'Core fetched', data: core });
    } catch (error: any) {
      res.status(500).json({ message: error.message, data: null });
    }
  }

  export {
    sanitizeCoreInput,
    findAll,
    findOne,
    add,
    update,
    remove,
    findOneByName
  };
  
  
  