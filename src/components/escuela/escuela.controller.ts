import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/orm.js';
import { Escuela } from './escuela.entity.js';
import { z } from 'zod';

const escuelaZodSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().trim().min(1),
  email: z.string().trim().email(),
  direccion: z.string().trim().min(1),
  telefono: z.string().trim().min(1),
});
const em = orm.em;

const validateEscuelaInput = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.body = escuelaZodSchema.parse(req.body);
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
    const escuelas = await em.find(Escuela, {});
    res.status(200).json(escuelas);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id;
    const escuela = await em.findOne(Escuela, { id });
    if (!escuela) {
      res.status(404).json({ message: 'School not found' });
    }
    res.status(200).json(escuela);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOneByName(req: Request, res: Response): Promise<void> {
  try {
    const nombre = req.params.nombre.toUpperCase();
    const excludeEscuelaId = req.query.excludeEscueladId;

    const query: any = {};

    if (nombre) {
      query.nombreEscuela = nombre;
    }
    if (excludeEscuelaId) {
      query.id = { $ne: excludeEscuelaId };
    }
    const escuela = await em.findOne(Escuela, query);

    if (!escuela) {
      res.status(200).json(null);
    }

    res.status(200).json(escuela);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response): Promise<void> {
  try {
    req.body.nombre = req.body.nombre.toUpperCase();
    const existingEscuela = await em.findOne(Escuela, {
      email: req.body.email,
    });
    if (existingEscuela) {
      res.status(409).json({ message: 'The school already exists' });
    } else {
      const escuela = em.create(Escuela, req.body);
      await em.flush();
      res.status(201).json({ message: 'School created', data: escuela });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while creating the school' });
  }
}

async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    req.body.nombre = req.body.nombre.toUpperCase();
    const escuelaToUpdate = await em.findOne(Escuela, { id });
    if (!escuelaToUpdate) {
      res.status(404).json({ message: 'School not found' });
    } else {
      em.assign(escuelaToUpdate, req.body);
      await em.flush();
      res.status(200).json({ message: 'School updated', data: escuelaToUpdate });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const escuelaToDelete = await em.findOne(Escuela, { id });
    if (escuelaToDelete) {
      await em.removeAndFlush(escuelaToDelete);
      res.status(200).json({ message: 'School deleted' });
    }
    res.status(404).json({ message: 'School not found' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, findOneByName, add, update, remove, validateEscuelaInput };
