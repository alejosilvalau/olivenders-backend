import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';
import { Core } from './core.entity.js';
import { z } from 'zod';
import { objectIdSchema } from '../../shared/db/objectIdSchema.js';

const coreZodSchema = z.object({
  id: objectIdSchema.optional(),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.number().positive(),
  wands: z.array(objectIdSchema),
});

const em = orm.em;

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

    res.status(200).json({ message: 'cores fetched', data: cores });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOneByName(req: Request, res: Response) {
  try {
    const name = req.params.name.toLowerCase();
    const core = await em.findOneOrFail(Core, { name });

    if (!core) {
      res.status(404).json({ message: 'core not found', data: null });
      return;
    }
    res.status(200).json({ message: 'core fetched', data: core });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const core = await em.findOneOrFail(Core, { id });

    if (!core) {
      res.status(404).json({ message: 'core not found', data: null });
      return;
    }
    res.status(200).json({ message: 'core fetched', data: core });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function add(req: Request, res: Response) {
  try {
    console.log('Cleared the EntityManager');
    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();

    const core = em.create(Core, input);
    await em.flush();

    res.status(201).json({ message: 'core created', data: core });
  } catch (error: any) {
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      res.status(409).json({
        message: 'a core with this name already exists',
        data: null,
      });
    } else {
      res.status(500).json({
        message: 'an error occurred while creating the core',
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

    const coreToUpdate = await em.findOneOrFail(Core, { id });
    em.assign(coreToUpdate, input);
    await em.flush();

    res.status(200).json({ message: 'core updated', data: coreToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const coreToDelete = await em.findOneOrFail(Core, { id }, { populate: ['wands'] });
    await em.removeAndFlush(coreToDelete);

    res.status(200).json({ message: 'core deleted', data: null });
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
  
  
  