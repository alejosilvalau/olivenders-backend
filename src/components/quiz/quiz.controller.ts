import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';
import { z } from 'zod';
import { Quiz } from './quiz.entity.js';

const em = orm.em;

const quizZodSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1),
});

function sanitizeQuizInput(req: Request, res: Response, next: NextFunction): void {
  try {
    const validatedInput = quizZodSchema.parse(req.body);

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

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const quizzes = await em.find(Quiz, {});
    res.status(200).json({ message: 'Quiz fetched', data: quizzes });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const quiz = await em.findOneOrFail(Quiz, { id });
    res.status(200).json({ message: 'Quiz fetched', data: quiz });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Quiz not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;

    input.created_at = new Date();

    const quiz = em.create(Quiz, input);
    await em.flush();
    res.status(201).json({ message: 'Quiz created', data: quiz });
  } catch (error: any) {
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      res.status(409).json({
        message: 'A quiz with this name already exists',
      });
    } else {
      res.status(500).json({
        message: 'An error occurred while creating the quiz',
      });
    }
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const input = req.body.sanitizedInput;

    const quizToUpdate = await em.findOneOrFail(Quiz, { id });
    em.assign(quizToUpdate, input);
    await em.flush();

    res.status(200).json({ message: 'Quiz updated', data: quizToUpdate });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Quiz not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const quizToDelete = await em.findOneOrFail(Quiz, { id });
    await em.removeAndFlush(quizToDelete);

    res.status(200).json({ message: 'Quiz deleted' });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Quiz not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

export { sanitizeQuizInput as sanitizeTestInput, findAll, findOne, add, update, remove };
