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
import { OrderSchemas } from './order.entity.js';
import { sanitizeMongoQuery } from '../../shared/db/sanitizeMongoQuery.js';
import { verifyAdminRole, verifyToken } from '../../middleware/authMiddleware.js';
import { createEndpoint, crudEndpoints } from '../../shared/docs/endpointBuilder.js';
import { parameterTemplates } from '../../shared/docs/parameterTemplates.js';
import { mergeEndpoint } from '../../shared/docs/mergeEndpoints.js';

export const orderPaths: { [key: string]: any } = {};
export const orderRouter = Router();

mergeEndpoint(orderPaths, crudEndpoints.getAll('/api/orders', OrderSchemas.Order, OrderSchemas.Order));
orderRouter.get('/', findAll);

mergeEndpoint(
  orderPaths,
  createEndpoint('/api/orders/wizard/{wizardId}', 'get')
    .summary('Get all orders by wizard')
    .tags([OrderSchemas.Order])
    .security([{ bearerAuth: [] }])
    .parameters([parameterTemplates.pathParam('wizardId', 'Wizard ID'), ...parameterTemplates.pagination])
    .paginatedResponse(OrderSchemas.Order)
    .build()
);
orderRouter.get('/wizard/:wizardId', sanitizeMongoQuery, verifyToken, findAllByWizard);

mergeEndpoint(
  orderPaths,
  createEndpoint('/api/orders/wand/{wandId}', 'get')
    .summary('Get all orders by wand')
    .tags([OrderSchemas.Order])
    .security([{ bearerAuth: [] }])
    .parameters([parameterTemplates.pathParam('wandId', 'Wand ID'), ...parameterTemplates.pagination])
    .paginatedResponse(OrderSchemas.Order)
    .build()
);
orderRouter.get('/wand/:wandId', sanitizeMongoQuery, verifyToken, verifyAdminRole, findAllByWand);

mergeEndpoint(orderPaths, crudEndpoints.getByIdAuth('/api/orders/{id}', OrderSchemas.Order, OrderSchemas.Order));
orderRouter.get('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, findOne);

mergeEndpoint(
  orderPaths,
  crudEndpoints.createAuth('/api/orders', OrderSchemas.OrderRequest, OrderSchemas.Order, OrderSchemas.Order)
);
orderRouter.post('/', sanitizeMongoQuery, verifyToken, sanitizeOrderInput, add);

mergeEndpoint(
  orderPaths,
  crudEndpoints.updateAuth('/api/orders/{id}', OrderSchemas.OrderRequest, OrderSchemas.Order, OrderSchemas.Order)
);
orderRouter.put('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, sanitizeOrderInput, update);

const statusEndpoints = [
  {
    path: '/api/orders/{id}/pay',
    summary: 'Pay for an order',
    description: 'Sets the order status to "paid" if payment is successful',
  },
];
orderRouter.patch('/:id/pay', sanitizeMongoQuery, verifyToken, pay);

statusEndpoints.push({
  path: '/api/orders/{id}/dispatch',
  summary: 'Dispatch an order',
  description: 'Sets the order status to "dispatched" if payment is successful',
});
orderRouter.patch('/:id/dispatch', sanitizeMongoQuery, verifyToken, verifyAdminRole, dispatch);

statusEndpoints.push({
  path: '/api/orders/{id}/complete',
  summary: 'Complete an order',
  description: 'Sets the order status to "completed" if payment is successful',
});
orderRouter.patch('/:id/complete', sanitizeMongoQuery, verifyToken, complete);

statusEndpoints.push({
  path: '/api/orders/{id}/cancel',
  summary: 'Cancel an order',
  description: 'Sets the order status to "cancelled" if payment is successful',
});
orderRouter.patch('/:id/cancel', sanitizeMongoQuery, verifyToken, cancel);

statusEndpoints.push({
  path: '/api/orders/{id}/refund',
  summary: 'Refund an order',
  description: 'Sets the order status to "refunded" if payment is successful',
});
orderRouter.patch('/:id/refund', sanitizeMongoQuery, verifyToken, refund);

// Status change endpoints
statusEndpoints.forEach(({ path, summary, description }) => {
  mergeEndpoint(
    orderPaths,
    createEndpoint(path, 'patch')
      .summary(summary)
      .description(description)
      .tags([OrderSchemas.Order])
      .security([{ bearerAuth: [] }])
      .parameters([parameterTemplates.idParam])
      .successResponse(OrderSchemas.Order)
      .build()
  );
});

mergeEndpoint(
  orderPaths,
  createEndpoint('/api/orders/{id}/review', 'patch')
    .summary('Review an order')
    .tags([OrderSchemas.Order])
    .security([{ bearerAuth: [] }])
    .parameters([parameterTemplates.idParam])
    .requestBody('OrderReviewRequest')
    .crudUpdateResponse(OrderSchemas.Order)
    .build()
);
orderRouter.patch('/:id/review', sanitizeMongoQuery, verifyToken, sanitizeOrderReviewInput, review);

mergeEndpoint(orderPaths, crudEndpoints.deleteAuth('/api/orders/{id}', OrderSchemas.Order));
orderRouter.delete('/:id', sanitizeMongoQuery, verifyToken, verifyAdminRole, remove);
