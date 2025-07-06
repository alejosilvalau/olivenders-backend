import { Router } from 'express';
import {
  sanitizeOrderInput,
  sanitizeOrderReviewInput,
  findAll,
  findOne,
  add,
  update,
  pay,
  dispatch,
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

orderRouter.patch('/:id/pay', sanitizeMongoQuery, pay);

orderRouter.patch('/:id/dispatch', sanitizeMongoQuery, dispatch);

orderRouter.patch('/:id/complete', sanitizeMongoQuery, complete);

orderRouter.patch('/:id/cancel', sanitizeMongoQuery, cancel);

orderRouter.patch('/:id/refund', sanitizeMongoQuery, refund);

orderRouter.patch('/:id/review', sanitizeMongoQuery, sanitizeOrderReviewInput, review);

orderRouter.delete('/:id', sanitizeMongoQuery, remove);
