import { Response } from 'express';
import { EntityManager } from '@mikro-orm/core';

export async function ensureEntityExists<T>(
  em: EntityManager,
  entityClass: { name: string },
  id: string,
  res: Response
): Promise<T | undefined> {
  try {
    const entity = await em.findOneOrFail(entityClass, { id });
    return entity as T;
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      const entityName = entityClass.name || 'Entity';
      res.status(404).json({ message: `${entityName} not found` });
      return undefined;
    }
    throw error;
  }
}