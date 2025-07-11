import { EntityManager, AnyEntity } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { Wizard } from '../../components/wizard/wizard.entity.js';
import { Wand } from '../../components/wand/wand.entity.js';
import { School } from '../../components/school/school.entity.js';
import { Wood } from '../../components/wood/wood.entity.js';
import { Core } from '../../components/core/core.entity.js';

async function _paginateEntity<T extends AnyEntity<T>>(
  em: EntityManager,
  entityClass: { new (): T } & Function,
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

export function paginateWand(
  em: EntityManager,
  req: Request,
  res: Response,
  findOptions: object = {},
  populate: string[] = ['wood', 'core']
) {
  return _paginateEntity(em, Wand, req, res, findOptions, populate);
}

export function paginateWizard(
  em: EntityManager,
  req: Request,
  res: Response,
  findOptions: object = {},
  populate: string[] = ['school'],
  sanitizer?: (items: Wizard[]) => Wizard[]
) {
  return _paginateEntity(em, Wizard, req, res, findOptions, populate, sanitizer);
}

export function paginateSchool(
  em: EntityManager,
  req: Request,
  res: Response,
  findOptions: object = {},
  populate: string[] = [],
  sanitizer?: (items: School[]) => School[]
) {
  return _paginateEntity(em, School, req, res, findOptions, populate, sanitizer);
}

export function paginateWood(
  em: EntityManager,
  req: Request,
  res: Response,
  findOptions: object = {},
  populate: string[] = [],
  sanitizer?: (items: Wood[]) => Wood[]
) {
  return _paginateEntity(em, Wood, req, res, findOptions, populate, sanitizer);
}

export function paginateCore(
  em: EntityManager,
  req: Request,
  res: Response,
  findOptions: object = {},
  populate: string[] = [],
  sanitizer?: (items: Core[]) => Core[]
) {
  return _paginateEntity(em, Core, req, res, findOptions, populate, sanitizer);
}
