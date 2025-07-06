import { Order } from '../../components/order/order.entity.js';
import { Wizard } from '../../components/wizard/wizard.entity.js';
import { wrap } from '@mikro-orm/core';

export function sanitizeWizardResponse(wizard: Wizard | null) {
  if (!wizard) return wizard;
  const obj = wrap(wizard).toObject() as any;
  delete obj.password;
  return obj;
}

export function sanitizeWizardResponseArray(wizards: Wizard[]) {
  return wizards.map(sanitizeWizardResponse);
}
