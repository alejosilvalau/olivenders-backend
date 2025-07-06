import { Router } from 'express';
import {
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
} from './order.controller.js';
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';

export const orderRouter = Router();

orderRouter.get('/', findAll);

orderRouter.get('/:id', sanitizeMongoQuery, findOne);

orderRouter.post('/', sanitizeMongoQuery, sanitizeOrderInput, add);

orderRouter.put('/:id', sanitizeMongoQuery, sanitizeOrderInput, update);

orderRouter.patch('/:id/pay', sanitizeMongoQuery, sanitizeOrderStatusInput, pay);

orderRouter.patch('/:id/dispatch', sanitizeMongoQuery, sanitizeOrderStatusInput, dispatch);

orderRouter.patch('/:id/deliver', sanitizeMongoQuery, sanitizeOrderStatusInput, deliver);

orderRouter.patch('/:id/complete', sanitizeMongoQuery, sanitizeOrderStatusInput, complete);

orderRouter.patch('/:id/cancel', sanitizeMongoQuery, sanitizeOrderStatusInput, cancel);

orderRouter.patch('/:id/refund', sanitizeMongoQuery, sanitizeOrderStatusInput, refund);

orderRouter.patch('/:id/review', sanitizeMongoQuery, sanitizeOrderReviewInput, review);

orderRouter.delete('/:id', sanitizeMongoQuery, remove);
