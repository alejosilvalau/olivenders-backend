import { Request, Response, NextFunction } from 'express';
import { objectIdSchema } from '../../shared/db/objectIdSchema.js';
import { orm } from '../../shared/db/orm.js';
import { z } from 'zod';
import { Order, OrderStatus, PaymentProvider } from './order.entity.js';

const em = orm.em;

const orderZodSchema = z.object({
  id: objectIdSchema.optional(),
  payment_reference: z.string().trim().min(1),
  payment_provider: z.nativeEnum(PaymentProvider),
});

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

const orderStatusZodSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

function sanitizeOrderStatusInput(req: Request, res: Response, next: NextFunction): void {
  try {
    const validatedInput = orderStatusZodSchema.parse(req.body);
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

const orderReviewZodSchema = z.object({
  review: z.string().trim().min(1),
});

function sanitizeOrderReviewInput(req: Request, res: Response, next: NextFunction): void {
  try {
    const validatedInput = orderReviewZodSchema.parse(req.body);
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

// async function findAllByWizard(req: Request, res: Response) {
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
    res.status(200).json({ message: 'Order fetched', data: order });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

// async function findOneByWand(req: Request, res: Response) {
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
    res.status(201).json({ message: 'Order created', data: order });
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while creating the order' });
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
    res.status(200).json({ message: 'Order updated', data: orderToUpdate });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function pay(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const orderToPay = await em.findOneOrFail(Order, { id });

    if (orderToPay.status !== OrderStatus.Pending) {
      res.status(400).json({ message: 'Order is not in a payable state' });
      return;
    }

    // Here you would integrate with the payment provider
    // For example, using Stripe or PayPal SDKs

    orderToPay.status = OrderStatus.Paid;
    await em.flush();
    res.status(200).json({ message: 'Order paid successfully', data: orderToPay });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function dispatch(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const orderToDispatch = await em.findOneOrFail(Order, { id });

    if (orderToDispatch.status !== OrderStatus.Paid) {
      res.status(400).json({ message: 'Order is not in a dispatchable state' });
      return;
    }

    // Here you would integrate with the shipping provider
    // For example, using a shipping API to create a shipment

    orderToDispatch.status = OrderStatus.Dispatched;
    await em.flush();
    res.status(200).json({ message: 'Order dispatched successfully', data: orderToDispatch });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function deliver(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const orderToDeliver = await em.findOneOrFail(Order, { id });

    if (orderToDeliver.status !== OrderStatus.Dispatched) {
      res.status(400).json({ message: 'Order is not in a deliverable state' });
      return;
    }

    // Here you would integrate with the delivery provider
    // For example, using a delivery API to confirm delivery

    orderToDeliver.status = OrderStatus.Delivered;
    await em.flush();
    res.status(200).json({ message: 'Order delivered successfully', data: orderToDeliver });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function complete(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const orderToComplete = await em.findOneOrFail(Order, { id });

    if (orderToComplete.status !== OrderStatus.Delivered) {
      res.status(400).json({ message: 'Order is not in a completable state' });
      return;
    }

    orderToComplete.status = OrderStatus.Completed;
    await em.flush();
    res.status(200).json({ message: 'Order completed successfully', data: orderToComplete });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function cancel(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const orderToCancel = await em.findOneOrFail(Order, { id });

    if (orderToCancel.status === OrderStatus.Completed || orderToCancel.status === OrderStatus.Refunded) {
      res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
      return;
    }

    orderToCancel.status = OrderStatus.Cancelled;
    await em.flush();
    res.status(200).json({ message: 'Order cancelled successfully', data: orderToCancel });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function refund(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const orderToRefund = await em.findOneOrFail(Order, { id });

    if (orderToRefund.status !== OrderStatus.Cancelled) {
      res.status(400).json({ message: 'Order is not in a refundable state' });
      return;
    }

    // Here you would integrate with the payment provider to process the refund
    // For example, using Stripe or PayPal SDKs

    orderToRefund.status = OrderStatus.Refunded;
    await em.flush();
    res.status(200).json({ message: 'Order refunded successfully', data: orderToRefund });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function review(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const orderToReview = await em.findOneOrFail(Order, { id });

    const reviewInput = req.body.sanitizedInput;

    // Add AI check here

    orderToReview.review = reviewInput.review;
    await em.flush();
    res.status(200).json({ message: 'Order reviewed successfully', data: orderToReview });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const orderToDelete = await em.findOneOrFail(Order, { id });
    await em.removeAndFlush(orderToDelete);
    em.clear();
    res.status(200).json({ message: 'Order deleted' });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

export {
  sanitizeOrderInput,
  sanitizeOrderStatusInput,
  sanitizeOrderReviewInput,
  findAll,
  findOne,
  add,
  update,
  pay,
  dispatch,
  deliver,
  complete,
  cancel,
  refund,
  review,
  remove,
};
