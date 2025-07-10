import { Response } from 'express';
import { EntityManager } from '@mikro-orm/core';

export async function ensureEntityExists(
  em: EntityManager,
  entityClass: any,
  id: string,
  res: Response
): Promise<boolean> {
  try {
    await em.findOneOrFail(entityClass, { id });
    return true;
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: `${entityClass.toString()} not found` });
      return false;
    }
    throw error;
  }
}
