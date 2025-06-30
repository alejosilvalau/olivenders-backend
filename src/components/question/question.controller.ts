import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/orm.js';
import { z } from 'zod';
import { Question } from './question.entity.js';

const questionZodSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().trim().min(1),
});

const em = orm.em;

const sanitizeQuestionInput = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const validatedInput = questionZodSchema.parse(req.body);

    req.body.sanitizedInput = {
      id: validatedInput.id,
      question: validatedInput.question,
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
};

async function findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const questions = await em.find(Question, {});
    res.status(200).json({ message: 'Questions fetched', data: questions });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id;
    const question = await em.findOne(Question, { id });
    if (!question) {
      res.status(404).json({ message: 'Question not found', data: null });
      return;
    }
    res.status(200).json({ message: 'Question fetched', data: question });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function add(req: Request, res: Response): Promise<void> {
  try {
    const input = req.body.sanitizedInput;
    input.question = input.question.toLowerCase();

    const existingQuestion = await em.findOne(Question, {
      id: input.id,
    });
    if (existingQuestion) {
      res.status(409).json({ message: 'The question already exists', data: null });
    } else {
      const question = em.create(Question, input);
      await em.flush();
      res.status(201).json({ message: 'Question created', data: question });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while creating the question', data: null });
  }
}

async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const input = req.body.sanitizedInput;
    input.question = input.question.toLowerCase();

    const questionToUpdate = await em.findOne(Question, { id });
    if (!questionToUpdate) {
      res.status(404).json({ message: 'Question not found', data: null });
    } else {
      em.assign(questionToUpdate, input);
      await em.flush();
      res.status(200).json({ message: 'Question updated', data: questionToUpdate });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const questionToDelete = await em.findOne(Question, { id });
    if (!questionToDelete) {
      res.status(404).json({ message: 'Question not found', data: null });
    } else {
      await em.removeAndFlush(questionToDelete!);
      res.status(200).json({ message: 'Question deleted', data: null });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

export { sanitizeQuestionInput, findAll, findOne, add, update, remove };
