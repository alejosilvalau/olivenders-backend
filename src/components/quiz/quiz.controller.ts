import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';
import { z } from 'zod';
import { Quiz } from './quiz.entity.js';
import { sanitizeInput } from '../../shared/db/sanitizeInput.js';
import { objectIdSchema } from '../../shared/db/objectIdSchema.js';

const em = orm.em;

const quizZodSchema = z.object({
  id: objectIdSchema.optional(),
  name: z.string().trim().min(1),
  questions: z.array(objectIdSchema),
});

const sanitizeQuizInput = sanitizeInput(quizZodSchema);

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const quizzes = await em.find(Quiz, {}, { populate: ['questions'] });
    res.status(200).json({ message: 'Quiz fetched', data: quizzes });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const quiz = await em.findOneOrFail(Quiz, { id }, { populate: ['questions'] });
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
