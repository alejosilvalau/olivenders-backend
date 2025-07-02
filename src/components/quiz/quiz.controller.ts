import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';
import { z } from 'zod';
import { Quiz } from './quiz.entity.js';

const quizZodSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1),
  date: z
    .string()
    .transform(val => new Date(val))
    .or(z.date()),
});

const em = orm.em;

function sanitizeQuizInput(req: Request, res: Response, next: NextFunction): void {
  try {
    const validatedInput = quizZodSchema.parse(req.body);

    // Always ensure date is a Date object for consistent processing
    if (validatedInput.date && isNaN(validatedInput.date.getTime())) {
      throw new Error('Invalid date format');
    }

    req.body.sanitizedInput = {
      id: validatedInput.id,
      name: validatedInput.name,
      date: validatedInput.date,
    };

    Object.keys(req.body.sanitizedInput).forEach(key => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    next();
  } catch (error: any) {
    if (error.errors) {
      const formattedError = error.errors.map((err: z.ZodIssue) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      res.status(400).json({ message: formattedError, data: null });
    } else {
      res.status(400).json({ message: [{ message: error.message }], data: null });
    }
  }
}

async function findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    em.clear();
    const quizzes = await em.find(Quiz, {});
    res.status(200).json({ message: 'Quizzes fetched', data: quizzes });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id;
    const quiz = await em.findOne(Quiz, { id });
    if (!quiz) {
      res.status(404).json({ message: 'Quiz not found', data: null });
      return;
    }
    res.status(200).json({ message: 'Quiz fetched', data: quiz });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOneById(id: string) {
  try {
    const quiz = await em.findOne(Quiz, { id });
    return quiz;
  } catch (error: any) {
    return error.message;
  }
}

async function add(req: Request, res: Response): Promise<void> {
  try {
    const input = req.body.sanitizedInput;
    input.name = input.name.toUpperCase();

    const existingQuiz = await em.findOne(Quiz, {
      id: input.id,
    });

    if (existingQuiz) {
      res.status(409).json({ message: 'The quiz already exists', data: null });
    } else {
      const quiz = em.create(Quiz, input);
      await em.flush();
      res.status(201).json({ message: 'Quiz created', data: quiz });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while creating the quiz', data: null });
  }
}

async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const input = req.body.sanitizedInput;

    // Convert name to uppercase if it's provided
    if (input.name) {
      input.name = input.name.toUpperCase();
    }

    const quizToUpdate = await em.findOne(Quiz, { id });
    if (!quizToUpdate) {
      res.status(404).json({ message: 'Quiz not found', data: null });
      return;
    }

    em.assign(quizToUpdate, input);
    await em.flush();
    res.status(200).json({ message: 'Quiz updated', data: quizToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const quizToDelete = await em.findOne(Quiz, { id });
    if (!quizToDelete) {
      res.status(404).json({ message: 'Quiz not found', data: null });
      return;
    }

    await em.removeAndFlush(quizToDelete);
    res.status(200).json({ message: 'Quiz deleted', data: null });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

export { sanitizeQuizInput as sanitizeTestInput, findAll, findOne, findOneById, add, update, remove };
