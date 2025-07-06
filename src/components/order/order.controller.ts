import { Request, Response, NextFunction } from 'express';
import { objectIdSchema } from '../../shared/db/objectIdSchema.js';
import { orm } from '../../shared/db/orm.js';
import { z } from 'zod';
import { Order } from './order.entity.js';

const orderZodSchema = z.object({
  id: objectIdSchema.optional(),
  payment_reference: z.string().trim().min(1),
  payment_provider: z.enum(['stripe', 'paypal', 'wire_transfer', 'credit_card', 'debit_card']),
  date: z.date(),
  status: z.enum(['pending', 'paid', 'dispatched', 'delivered', 'completed', 'cancelled', 'refunded']),
  review: z.string().trim().min(1).optional(),
});

const em = orm.em;

function sanitizeOrderInput(req: Request, res: Response, next: NextFunction): void {
  try {
    const validatedInput = orderZodSchema.parse(req.body);
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

async function findAll(req: Request, res: Response): Promise<void> {
  try {
    em.clear();
    const orders = await em.find(Order, {});
    res.status(200).json({ message: 'Orders fetched', data: orders });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findOne(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const order = await em.findOne(Order, { id });
    if (!order) {
      res.status(404).json({ message: 'Order not found', data: null });
      return;
    }
    res.status(200).json({ message: 'Order fetched', data: order });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findByPaymentId(req: Request, res: Response): Promise<void> {
  try {
    const payment_reference = req.params.payment_reference;

    const order = await em.findOne(Order, { payment_reference });
    if (!order) {
      res.status(404).json({ message: 'Order not found', data: null });
      return;
    }
    res.status(200).json({ message: 'Order fetched', data: order });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function findByStatus(req: Request, res: Response): Promise<void> {
  try {
    const status = req.params.status;
    const orders = await em.find(Order, { status });
    res.status(200).json({ message: 'Orders fetched', data: orders });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function add(req: Request, res: Response): Promise<void> {
  try {
    const input = req.body.sanitizedInput;

    // Check if an order with the same payment_id already exists
    const existingOrder = await em.findOne(Order, {
      payment_reference: input.payment_id,
    });

    if (existingOrder) {
      res.status(409).json({ message: 'An order with this payment ID already exists', data: null });
    } else {
      const order = em.create(Order, input);
      await em.flush();
      res.status(201).json({ message: 'Order created', data: order });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while creating the order', data: null });
  }
}

async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const input = req.body.sanitizedInput;

    const orderToUpdate = await em.findOne(Order, { id });
    if (!orderToUpdate) {
      res.status(404).json({ message: 'Order not found', data: null });
      return;
    }

    em.assign(orderToUpdate, input);
    await em.flush();
    res.status(200).json({ message: 'Order updated', data: orderToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const orderToDelete = await em.findOne(Order, { id });
    if (!orderToDelete) {
      res.status(404).json({ message: 'Order not found', data: null });
      return;
    }

    await em.removeAndFlush(orderToDelete);
    res.status(200).json({ message: 'Order deleted', data: null });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: null });
  }
}

export { sanitizeOrderInput, findAll, findOne, findByStatus, findByPaymentId, add, update, remove };
