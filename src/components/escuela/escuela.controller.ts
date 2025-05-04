import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/orm';
import { Escuela } from './escuela.entity';
import { z } from 'zod';

const escuelaZodSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().trim().min(1),
  email: z.string().trim().email(),
  direccion: z.string().trim().min(1),
  telefono: z.string().trim().min(1),
});
const em = orm.em;

const validateEscuelaInput = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = escuelaZodSchema.parse(req.body);
    next();
    return;
  } catch (error: any) {
    const formattedError = error.errors.map((err: z.ZodIssue) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return res.status(400).json({ errors: formattedError });
  }
};

async function findAll(req: Request, res: Response) {
  try {
    const escuelas = await em.find(Escuela, {});
    return res.status(200).json(escuelas);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const escuela = await em.findOne(Escuela, { id });
    if (!escuela) {
      return res.status(404).json({ message: 'School not found' });
    }
    return res.status(200).json(escuela);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

async function findOneByName(req: Request, res: Response) {
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
      return res.status(200).json(null);
    }

    return res.status(200).json(escuela);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    req.body.nombre = req.body.nombre.toUpperCase(); // Transform 'nombre' to uppercase
    const escuelaExistente = await em.findOne(Escuela, {
      email: req.body.email,
    });
    if (escuelaExistente) {
      return res.status(409).json({ message: 'The school already exists' });
    } else {
      const escuela = em.create(Escuela, req.body);
      await em.flush();
      return res.status(201).json({ message: 'School created', data: escuela });
    }
  } catch (error: any) {
    return res.status(500).json({ message: 'An error occurred while creating the school' });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const escuelaToUpdate = await em.findOne(Escuela, { id });
    if (!escuelaToUpdate) {
      return res.status(404).json({ message: 'School not found' });
    } else {
      em.assign(escuelaToUpdate, req.body);
      await em.flush();
      return res.status(200).json({ message: 'School updated', data: escuelaToUpdate });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const escuelaToDelete = await em.findOne(Escuela, { id });
    if (!escuelaToDelete) {
      return res.status(404).json({ message: 'School not found' });
    }
    await em.removeAndFlush(escuelaToDelete);
    return res.status(200).json({ message: 'School deleted' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, findOneByName, add, update, remove, validateEscuelaInput };
