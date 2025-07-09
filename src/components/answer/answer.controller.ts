import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';
import { z } from 'zod';
import { objectIdSchema } from '../../shared/db/objectIdSchema.js';
import { Answer } from './answer.entity.js';
import { sanitizeInput } from '../../shared/db/sanitizeInput.js';

const em = orm.em;

const answerZodSchema = z.object({
  id: objectIdSchema.optional(),
  score: z.number().int().positive(),
});

const sanitizeAnswerInput = sanitizeInput(answerZodSchema);

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const answers = await em.find(Answer, {});
    res.status(200).json({ message: 'Answers fetched', data: answers });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const answer = await em.findOneOrFail(Answer, { id });
    res.status(200).json({ message: 'Answer fetched', data: answer });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Answer not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;

    input.created_at = new Date();

    const answer = em.create(Answer, input);
    await em.flush();

    res.status(201).json({ message: 'Answer created', data: answer });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const input = req.body.sanitizedInput;

    const answer = await em.findOneOrFail(Answer, { id });
    em.assign(answer, input);
    await em.flush();

    res.status(200).json({ message: 'Answer updated', data: answer });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Answer not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const answer = await em.findOneOrFail(Answer, { id });
    await em.removeAndFlush(answer);
    res.status(200).json({ message: 'Answer deleted' });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Answer not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}
export { findAll, findOne, add, update, remove, sanitizeAnswerInput };
