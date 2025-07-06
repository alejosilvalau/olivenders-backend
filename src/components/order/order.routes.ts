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

orderRouter.get('/:id', findOne);

orderRouter.post('/', add);

orderRouter.put('/:id', update);

orderRouter.delete('/:id', remove);
