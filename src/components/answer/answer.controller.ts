import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';
import { z } from 'zod';
import { objectIdSchema } from '../../shared/db/objectIdSchema.js';
import { Answer } from './answer.entity.js';
import { sanitizeInput } from '../../shared/db/sanitizeInput.js';
import { Wand, WandStatus } from '../wand/wand.entity.js';
import { Quiz } from '../quiz/quiz.entity.js';
import { Wizard } from '../wizard/wizard.entity.js';
import { sanitizeAnswerResponse, sanitizeAnswerResponseArray } from '../../shared/entities/sanitizeAnswerResponse.js';

const em = orm.em;

const answerZodSchema = z.object({
  id: objectIdSchema.optional(),
  score: z.number().int().positive(),
  quiz: objectIdSchema,
  wizard: objectIdSchema,
});

const sanitizeAnswerInput = sanitizeInput(answerZodSchema);

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const answers = await em.find(Answer, {}, { populate: ['quiz', 'wizard', 'wand'] });
    const sanitizedResponses = sanitizeAnswerResponseArray(answers);
    res.status(200).json({ message: 'Answers fetched', data: sanitizedResponses });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const answer = await em.findOneOrFail(Answer, { id }, { populate: ['quiz', 'wizard', 'wand'] });

    const sanitizedResponse = sanitizeAnswerResponse(answer);
    res.status(200).json({ message: 'Answer fetched', data: sanitizedResponse });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Answer not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function getRandomWandByScore(score: number): Promise<Wand> {
  try {
    const totalCount = await em.count(Wand, { status: WandStatus.Available });

    if (totalCount === 0) {
      throw { status: 404, message: 'No available wands found' };
    }

    // Calculate offset based on score
    const offset = score % totalCount;
    const [wand] = await em.find(Wand, { status: WandStatus.Available }, { limit: 1, offset });

    if (!wand) {
      throw { status: 404, message: 'Wand not found at calculated position' };
    }

    return wand;
  } catch (error: any) {
    if (!error.status) {
      throw { status: 500, message: error.message || 'Unknown error occurred' };
    }
    throw error;
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;

    input.created_at = new Date();

    // Check for quiz
    try {
      await em.findOneOrFail(Quiz, { id: input.quiz });
    } catch (error: any) {
      if (error.name === 'NotFoundError') {
        res.status(404).json({ message: 'Quiz not found' });
        return;
      }
      throw error;
    }

    // Check for wizard
    try {
      await em.findOneOrFail(Wizard, { id: input.wizard });
    } catch (error: any) {
      if (error.name === 'NotFoundError') {
        res.status(404).json({ message: 'Wizard not found' });
        return;
      }
      throw error;
    }

    // Get wand by score
    try {
      input.wand = await getRandomWandByScore(input.score);
    } catch (error: any) {
      res.status(error.status || 404).json({ message: error.message });
      return;
    }

    const answer = em.create(Answer, input);
    await em.flush();

    const sanitizedResponse = sanitizeAnswerResponse(answer);
    res.status(201).json({ message: 'Answer created', data: sanitizedResponse });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const input = req.body.sanitizedInput;
    const answer = await em.findOneOrFail(Answer, { id });

    // Check for quiz
    try {
      await em.findOneOrFail(Quiz, { id: input.quiz });
    } catch (error: any) {
      if (error.name === 'NotFoundError') {
        res.status(404).json({ message: 'Quiz not found' });
        return;
      }
      throw error;
    }

    // Check for wizard
    try {
      await em.findOneOrFail(Wizard, { id: input.wizard });
    } catch (error: any) {
      if (error.name === 'NotFoundError') {
        res.status(404).json({ message: 'Wizard not found' });
        return;
      }
      throw error;
    }

    // Get wand by score
    try {
      input.wand = await getRandomWandByScore(input.score);
    } catch (error: any) {
      res.status(error.status || 404).json({ message: error.message });
      return;
    }

    em.assign(answer, input);
    await em.flush();

    const sanitizedResponse = sanitizeAnswerResponse(answer);
    res.status(200).json({ message: 'Answer updated', data: sanitizedResponse });
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
