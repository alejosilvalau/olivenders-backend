import { Request, Response, NextFunction } from 'express';
import { objectIdSchema } from '../../shared/db/objectIdSchema.js';
import { orm } from '../../shared/db/orm.js';
import { z } from 'zod';
import { Order, OrderStatus, PaymentProvider } from './order.entity.js';

const orderZodSchema = z.object({
  id: objectIdSchema.optional(),
  payment_reference: z.string().trim().min(1),
  payment_provider: z.enum([...Object.values(PaymentProvider)] as [string, ...string[]]),
});

const orderReviewZodSchema = z.object({
  id: objectIdSchema.optional(),
  review: z.string().trim().min(1),
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
    res.status(400).json({ message: formattedError });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const orders = await em.find(Order, {});
    res.status(200).json({ message: 'Orders fetched', data: orders });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// async function findAllByUser(req: Request, res: Response) {
//   try {
//     const idComprador = req.params.userId;
//     const compras = await em.find(
//       Compra,
//       { usuario: idComprador },
//       { populate: ['usuario', 'vehiculo', 'vehiculo.propietario'] }
//     );
//     res.status(200).json(compras);
//   } catch (error: any) {
//     res.status(500).json({ message: 'Error al obtener las compras por usuario', error: error.message });
//   }
// }

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const order = await em.findOneOrFail(Order, { id });
    res.status(200).json({ message: 'order fetched', data: order });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'wand not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

// async function findOneByVehiculo(req: Request, res: Response) {
//   try {
//     const idVehiculo = req.params.idVehiculo;
//     const compra = await em.findOne(Compra, { vehiculo: idVehiculo }, { populate: ['usuario', 'vehiculo'] });
//     res.status(200).json(compra);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();

    input.date = new Date();
    input.status = OrderStatus.Pending;

    const order = em.create(Order, input);
    await em.flush();
    res.status(201).json({ message: 'order created', data: order });
  } catch (error: any) {
    res.status(500).json({ message: 'an error occurred while creating the order' });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const input = req.body.sanitizedInput;
    input.name = input.name.toLowerCase();

    const orderToUpdate = await em.findOneOrFail(Order, id);
    em.assign(orderToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'order updated', data: orderToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const orderToDelete = await em.findOneOrFail(Order, { id });
    await em.removeAndFlush(orderToDelete);
    em.clear();
    res.status(200).json({ message: 'order deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export {
  sanitizeOrderInput,
  findAll,
  findOne,
  findByStatus,
  findByPaymentReference as findByPaymentId,
  add,
  update,
  remove,
};
