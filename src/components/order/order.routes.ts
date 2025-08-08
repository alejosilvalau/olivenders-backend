import { Router } from 'express';
import {
  sanitizeOrderInput,
  sanitizeOrderReviewInput,
  findAll,
  findAllByWizard,
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
import { verifyAdminRole, verifyToken } from '../../middleware/authMiddleware.js';

export const orderRouter = Router();

orderRouter.get('/', findAll);

orderRouter.get('/wizard/:wizardId', sanitizeMongoQuery, verifyToken, findAllByWizard);

orderRouter.get('/wand/:wandId', sanitizeMongoQuery, verifyToken, findAllByWizard);

orderRouter.get('/:id', sanitizeMongoQuery, verifyToken, findOne);

orderRouter.post('/', sanitizeMongoQuery, verifyToken, sanitizeOrderInput, add);

orderRouter.put('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeOrderInput, update);

orderRouter.patch('/:id/pay', sanitizeMongoQuery, verifyToken, pay);

orderRouter.patch('/:id/dispatch', sanitizeMongoQuery, verifyToken, verifyAdminRole, dispatch);

orderRouter.patch('/:id/complete', sanitizeMongoQuery, verifyToken, complete);

orderRouter.patch('/:id/cancel', sanitizeMongoQuery, verifyToken, cancel);

orderRouter.patch('/:id/refund', sanitizeMongoQuery, verifyToken, refund);

orderRouter.patch('/:id/review', sanitizeMongoQuery, verifyToken, sanitizeOrderReviewInput, review);

orderRouter.delete('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, remove);
