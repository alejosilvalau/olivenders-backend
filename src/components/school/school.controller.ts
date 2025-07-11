import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';
import { School } from './school.entity.js';
import { z } from 'zod';
import { objectIdSchema } from '../../shared/db/objectIdSchema.js';
import { sanitizeInput } from '../../shared/db/sanitizeInput.js';
import { paginateEntity } from '../../shared/db/paginateEntity.js';

const em = orm.em;

const schoolZodSchema = z.object({
  id: objectIdSchema.optional(),
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  address: z.string().trim().min(1),
  phone: z.string().trim().min(1),
});

const sanitizeSchoolInput = sanitizeInput(schoolZodSchema);

async function findAll(req: Request, res: Response, next: NextFunction) {
  return paginateEntity(School, em, req, res);
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const school = await em.findOneOrFail(School, { id });
    res.status(200).json({ message: 'School fetched', data: school });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'School not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function findOneByName(req: Request, res: Response) {
  try {
    const name = req.params.name.toLowerCase();
    const school = await em.findOneOrFail(School, { name });
    res.status(200).json({ message: 'School fetched', data: school });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'School not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();
    input.email = input.email.toLowerCase();
    input.wizards = [];

    const school = em.create(School, input);
    await em.flush();
    res.status(201).json({ message: 'School created', data: school });
  } catch (error: any) {
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      res.status(409).json({
        message: 'A school with this name or email already exists',
      });
    } else {
      res.status(500).json({
        message: 'An error occurred while creating the school',
      });
    }
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();
    input.email = input.email.toLowerCase();

    const schoolToUpdate = await em.findOneOrFail(School, { id });
    em.assign(schoolToUpdate, input);
    await em.flush();
    res.status(200).json({ message: 'School updated', data: schoolToUpdate });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'School not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const schoolToDelete = await em.findOneOrFail(School, { id }, { populate: ['wizards', 'wizards.orders'] });
    await em.removeAndFlush(schoolToDelete);
    res.status(200).json({ message: 'School deleted' });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'School not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

export { sanitizeSchoolInput, findAll, findOne, findOneByName, add, update, remove };
