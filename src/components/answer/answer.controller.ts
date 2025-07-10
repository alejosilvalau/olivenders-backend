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
import { ensureEntityExists } from '../../shared/db/ensureEntityExists.js';

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

    const offset = score % totalCount;
    const wand = await em.findOneOrFail(Wand, { status: WandStatus.Available }, { offset });

    return wand;
  } catch (error: any) {
    if (error.name === 'NotFoundError' || error.status === 404) {
      throw { status: 404, message: 'Wand not found at calculated position' };
    }
    throw { status: 500, message: error.message || 'Unknown error occurred' };
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;

    if (!(await ensureEntityExists<Quiz>(em, Quiz, input.quiz, res))) return;
    if (!(await ensureEntityExists<Wizard>(em, Wizard, input.wizard, res))) return;

    input.created_at = new Date();

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

    if (!(await ensureEntityExists<Quiz>(em, Quiz, input.quiz, res))) return;
    if (!(await ensureEntityExists<Wizard>(em, Wizard, input.wizard, res))) return;

    const answer = await em.findOneOrFail(Answer, { id });

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
