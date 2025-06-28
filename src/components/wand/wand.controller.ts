import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/orm.js';
import { Wand } from './wand.entity.js';
import { z } from 'zod';

const wandZodSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1),
  length: z.number().positive(),
  flexibility: z.string().trim().min(1),
  description: z.string().trim().min(1),
  status: z.string().trim().min(1),
  image: z.string().trim().min(1),
  profit_margin: z.number().nonnegative(),
  total_price: z.number().positive(),
});

const em = orm.em;

function sanitizeWandInput(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedInput = wandZodSchema.parse(req.body);

    req.body.sanitizedInput = {
      id: validatedInput.id,
      name: validatedInput.name,
      length: validatedInput.length,
      flexibility: validatedInput.flexibility,
      description: validatedInput.description,
      status: validatedInput.status,
      image: validatedInput.image,
      profit_margin: validatedInput.profit_margin,
      total_price: validatedInput.total_price,
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
}



async function findAll(req: Request, res: Response) {
  try {
    em.clear();
    const wands = await em.find(Wand, {});
    res.status(200).json({ message: 'Wands fetched', data: wands });
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
    const wand = await em.findOneOrFail(Wand, { id });
    if (!wand) {
      res.status(404).json({ message: 'Wand not found', data: null });
      return;
    }
    res.status(200).json({ message: 'Wand fetched', data: wand });
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

async function findOneById(id: string) {
  const wand = await em.findOne(Wand, { id });
  try {
    return wand;
  } catch (error: any) {
    return error.message;
  }
}

async function add(req: Request, res: Response): Promise<void> {
  try {
    const input = req.body.sanitizedInput;
    input.name = input.name.toUpperCase();

    const existingWand = await em.findOne(Wand, {
      id: input.id,
    });
    if (existingWand) {
      res.status(409).json({ message: 'The wand already exists', data: null });
    } else {
      const wand = em.create(Wand, input);
      await em.flush();
      res.status(201).json({ message: 'Wand created', data: wand });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while creating the wand', data: null });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wandToUpdate = await em.findOneOrFail(Wand, { id });
    if (!wandToUpdate) {
      return res.status(404).json({ message: 'Wand not found' });
    }
    em.assign(wandToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'Wand updated', data: wandToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


// TODO: Check the methods below
async function logicRemove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wand = await em.findOne(Wand, { id });
    if (!wand) {
      return res.status(404).json({ message: 'Wand not found', data: null });
    }
    wand.status = 'inactive';
    await em.flush();
    res.status(200).json({ message: 'Wand deactivated', data: wand });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const wandToDelete = await em.findOne(Wand, { id });
    if (!wandToDelete) {
      res.status(404).json({ message: 'Wand not found', data: null });
    } else {
      await em.removeAndFlush(wandToDelete!);
      res.status(200).json({ message: 'Wand deleted', data: null });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

export { sanitizeWandInput, findAll, findOne, add, update, remove, logicRemove, findOneById };
