import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';
import { z } from 'zod';
import { Question } from './question.entity.js';
import { objectIdSchema } from '../../shared/db/objectIdSchema.js';

const em = orm.em;

const questionZodSchema = z.object({
  id: objectIdSchema.optional(),
  question: z.string().trim().min(1),
});

const sanitizeQuestionInput = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const validatedInput = questionZodSchema.parse(req.body);

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

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const questions = await em.find(Question, {});
    res.status(200).json({ message: 'Questions fetched', data: questions });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const question = await em.findOneOrFail(Question, { id });
    res.status(200).json({ message: 'Question fetched', data: question });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Question not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;
    const question = em.create(Question, input);

    input.created_at = new Date();

    await em.flush();
    res.status(201).json({ message: 'Question created', data: question });
  } catch (error: any) {
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      res.status(409).json({
        message: 'A question with this name already exists',
      });
    } else {
      res.status(500).json({
        message: 'An error occurred while creating the question',
      });
    }
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const input = req.body.sanitizedInput;

    const questionToUpdate = await em.findOneOrFail(Question, { id });
    em.assign(questionToUpdate, input);
    await em.flush();

    res.status(200).json({ message: 'Question updated', data: questionToUpdate });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Question not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const questionToDelete = await em.findOneOrFail(Question, { id });
    await em.removeAndFlush(questionToDelete);

    res.status(200).json({ message: 'Question deleted' });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Question not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

export { sanitizeQuestionInput, findAll, findOne, add, update, remove };
