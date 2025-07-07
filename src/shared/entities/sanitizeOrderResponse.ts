import { Order } from '../../components/order/order.entity.js';
import { sanitizeWandResponse } from './sanitizeWandResponse.js';
import { sanitizeWizardResponse } from './sanitizeWizardResponse.js';
import { wrap } from '@mikro-orm/core';

export function sanitizeOrderResponse(order: Order) {
  if (!order) return order;
  const obj = wrap(order).toObject() as any;
  obj.wizard = sanitizeWizardResponse(order.wizard);
  obj.wand = sanitizeWandResponse(order.wand);
  return obj;
}

export function sanitizeOrderResponseArray(orders: Order[]) {
  return orders.map(sanitizeOrderResponse);
}
