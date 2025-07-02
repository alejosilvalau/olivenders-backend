import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';
import { z } from 'zod';
import { Sale } from './sale.entity.js';

const saleZodSchema = z.object({
  id: z.string().uuid().optional(),
  payment_id: z.number().int().positive(),
  date: z
    .string()
    .transform(val => new Date(val))
    .or(z.date()),
  status: z.string().trim().min(1),
  review: z.string().trim().min(1),
});

const em = orm.em;

function sanitizeSaleInput(req: Request, res: Response, next: NextFunction): void {
  try {
    const validatedInput = saleZodSchema.parse(req.body);

    // Check if the date is valid after transformation
    if (validatedInput.date && isNaN(validatedInput.date.getTime())) {
      throw new Error('Invalid date format');
    }

    req.body.sanitizedInput = {
      id: validatedInput.id,
      payment_id: validatedInput.payment_id,
      date: validatedInput.date,
      status: validatedInput.status,
      review: validatedInput.review,
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
      res.status(400).json({ message: [{ field: error.path || 'unknown', message: error.message }], data: null });
    }
  }
}

async function findAll(req: Request, res: Response): Promise<void> {
  try {
    em.clear();
    const sales = await em.find(Sale, {});
    res.status(200).json({ message: 'Sales fetched', data: sales });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOne(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const sale = await em.findOne(Sale, { id });
    if (!sale) {
      res.status(404).json({ message: 'Sale not found', data: null });
      return;
    }
    res.status(200).json({ message: 'Sale fetched', data: sale });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findByPaymentId(req: Request, res: Response): Promise<void> {
  try {
    const payment_id = parseInt(req.params.payment_id);
    if (isNaN(payment_id)) {
      res.status(400).json({ message: 'Invalid payment ID', data: null });
      return;
    }

    const sale = await em.findOne(Sale, { payment_id });
    if (!sale) {
      res.status(404).json({ message: 'Sale not found', data: null });
      return;
    }
    res.status(200).json({ message: 'Sale fetched', data: sale });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findByStatus(req: Request, res: Response): Promise<void> {
  try {
    const status = req.params.status;
    const sales = await em.find(Sale, { status });
    res.status(200).json({ message: 'Sales fetched', data: sales });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function add(req: Request, res: Response): Promise<void> {
  try {
    const input = req.body.sanitizedInput;

    // Check if a sale with the same payment_id already exists
    const existingSale = await em.findOne(Sale, {
      payment_id: input.payment_id,
    });

    if (existingSale) {
      res.status(409).json({ message: 'A sale with this payment ID already exists', data: null });
    } else {
      const sale = em.create(Sale, input);
      await em.flush();
      res.status(201).json({ message: 'Sale created', data: sale });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while creating the sale', data: null });
  }
}

async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const input = req.body.sanitizedInput;

    const saleToUpdate = await em.findOne(Sale, { id });
    if (!saleToUpdate) {
      res.status(404).json({ message: 'Sale not found', data: null });
      return;
    }

    em.assign(saleToUpdate, input);
    await em.flush();
    res.status(200).json({ message: 'Sale updated', data: saleToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const saleToDelete = await em.findOne(Sale, { id });
    if (!saleToDelete) {
      res.status(404).json({ message: 'Sale not found', data: null });
      return;
    }

    await em.removeAndFlush(saleToDelete);
    res.status(200).json({ message: 'Sale deleted', data: null });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

export { sanitizeSaleInput, findAll, findOne, findByPaymentId, findByStatus, add, update, remove };
