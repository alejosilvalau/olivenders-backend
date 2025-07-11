import { EntityManager, AnyEntity } from '@mikro-orm/core';
import { Request, Response } from 'express';

export async function paginateEntity<T extends AnyEntity<T>>(
  entityClass: { new (): T } & Function,
  em: EntityManager,
  req: Request,
  res: Response,
  findOptions: object = {},
  populate: string[] = [],
  sanitizer?: (items: T[]) => any
): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    const [items, total] = await em.findAndCount(entityClass, findOptions, {
      populate: populate as any,
      limit: pageSize,
      offset,
    });

    const data = sanitizer ? sanitizer(items) : items;
    const totalPages = Math.ceil(total / pageSize);
    res.status(200).json({
      message: `${entityClass.name}s fetched`,
      data,
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
