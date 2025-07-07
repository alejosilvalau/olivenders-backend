import { Wand } from '../../components/wand/wand.entity.js';
import { wrap } from '@mikro-orm/core';

export function sanitizeWandResponse(wand: Wand | null) {
  if (!wand) return wand;
  const obj = wrap(wand).toObject() as any;
  delete obj.order;
  return obj;
}
