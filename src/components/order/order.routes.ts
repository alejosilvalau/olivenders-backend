import { Router } from 'express';
import {
  sanitizeOrderInput,
  sanitizeOrderReviewInput,
  findAll,
  findAllByWizard,
  findAllByWand,
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
import { createEndpoint, crudEndpoints } from '../../shared/docs/endpointBuilder.js';
import { parameterTemplates } from '../../shared/docs/parameterTemplates.js';
import { mergeEndpoint } from '../../shared/docs/mergeEndpoints.js';

export const orderPaths: { [key: string]: any } = {};
export const orderRouter = Router();

// Basic CRUD endpoints
mergeEndpoint(orderPaths, crudEndpoints.getAll('/api/orders', 'Order', 'Order'));
mergeEndpoint(orderPaths, crudEndpoints.getById('/api/orders/{id}', 'Order', 'Order'));
mergeEndpoint(orderPaths, crudEndpoints.create('/api/orders', 'OrderRequest', 'Order', 'Order'));
mergeEndpoint(orderPaths, crudEndpoints.update('/api/orders/{id}', 'OrderRequest', 'Order', 'Order'));
mergeEndpoint(orderPaths, crudEndpoints.delete('/api/orders/{id}', 'Order'));

// Custom endpoints
mergeEndpoint(
  orderPaths,
  createEndpoint('/api/orders/wizard/{wizardId}', 'get')
    .summary('Get all orders by wizard')
    .tags(['Order'])
    .security([{ bearerAuth: [] }])
    .parameters([parameterTemplates.pathParam('wizardId', 'Wizard ID'), ...parameterTemplates.pagination])
    .paginatedResponse('Order')
    .build()
);

mergeEndpoint(
  orderPaths,
  createEndpoint('/api/orders/wand/{wandId}', 'get')
    .summary('Get all orders by wand')
    .tags(['Order'])
    .security([{ bearerAuth: [] }])
    .parameters([parameterTemplates.pathParam('wandId', 'Wand ID'), ...parameterTemplates.pagination])
    .paginatedResponse('Order')
    .build()
);

// Status change endpoints
const statusEndpoints = [
  { path: '/api/orders/{id}/pay', summary: 'Pay for an order' },
  { path: '/api/orders/{id}/dispatch', summary: 'Dispatch an order' },
  { path: '/api/orders/{id}/complete', summary: 'Complete an order' },
  { path: '/api/orders/{id}/cancel', summary: 'Cancel an order' },
  { path: '/api/orders/{id}/refund', summary: 'Refund an order' },
];

statusEndpoints.forEach(({ path, summary }) => {
  mergeEndpoint(
    orderPaths,
    createEndpoint(path, 'patch')
      .summary(summary)
      .tags(['Order'])
      .parameters([parameterTemplates.idParam])
      .successResponse('Order')
      .build()
  );
});

// Review endpoint
mergeEndpoint(
  orderPaths,
  createEndpoint('/api/orders/{id}/review', 'patch')
    .summary('Review an order')
    .tags(['Order'])
    .parameters([parameterTemplates.idParam])
    .requestBody('OrderReviewRequest')
    .crudUpdateResponse('Order')
    .build()
);

orderRouter.get('/', findAll);

orderRouter.get('/wizard/:wizardId', sanitizeMongoQuery, verifyToken, findAllByWizard);

orderRouter.get('/wand/:wandId', sanitizeMongoQuery, verifyToken, verifyAdminRole, findAllByWand);

orderRouter.get('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, findOne);

orderRouter.post('/', sanitizeMongoQuery, verifyToken, sanitizeOrderInput, add);

orderRouter.put('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeOrderInput, update);

orderRouter.patch('/:id/pay', sanitizeMongoQuery, verifyToken, pay);

orderRouter.patch('/:id/dispatch', sanitizeMongoQuery, verifyToken, verifyAdminRole, dispatch);

orderRouter.patch('/:id/complete', sanitizeMongoQuery, verifyToken, complete);

orderRouter.patch('/:id/cancel', sanitizeMongoQuery, verifyToken, cancel);

orderRouter.patch('/:id/refund', sanitizeMongoQuery, verifyToken, refund);

orderRouter.patch('/:id/review', sanitizeMongoQuery, verifyToken, sanitizeOrderReviewInput, review);

orderRouter.delete('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, remove);
