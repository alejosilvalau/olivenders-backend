import { Response } from 'express';
import { EntityManager, AnyEntity } from '@mikro-orm/core';
import { Wizard } from '../../components/wizard/wizard.entity.js';
import { Wood } from '../../components/wood/wood.entity.js';
import { Quiz } from '../../components/quiz/quiz.entity.js';
import { Wand } from '../../components/wand/wand.entity.js';
import { School } from '../../components/school/school.entity.js';
import { Core } from '../../components/core/core.entity.js';

async function _ensureEntityExists<T extends AnyEntity<T>>(
  em: EntityManager,
  entityClass: { new (): T } & Function,
  id: string,
  res: Response
): Promise<T | undefined> {
  try {
    const entity = await em.findOneOrFail(entityClass, { id });
    return entity;
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      const entityName = entityClass.name || 'Entity';
      res.status(404).json({ message: `${entityName} not found` });
      return undefined;
    }
    throw error;
  }
}

export function ensureWoodExists(em: EntityManager, id: string, res: Response): Promise<Wood | undefined> {
  return _ensureEntityExists(em, Wood, id, res);
}

export function ensureCoreExists(em: EntityManager, id: string, res: Response): Promise<Core | undefined> {
  return _ensureEntityExists(em, Core, id, res);
}

export function ensureWizardExists(em: EntityManager, id: string, res: Response): Promise<Wizard | undefined> {
  return _ensureEntityExists(em, Wizard, id, res);
}

export function ensureQuizExists(em: EntityManager, id: string, res: Response): Promise<Quiz | undefined> {
  return _ensureEntityExists(em, Quiz, id, res);
}

export function ensureWandExists(em: EntityManager, id: string, res: Response): Promise<Wand | undefined> {
  return _ensureEntityExists(em, Wand, id, res);
}

export function ensureSchoolExists(em: EntityManager, id: string, res: Response): Promise<School | undefined> {
  return _ensureEntityExists(em, School, id, res);
}

export function ensureQuestionExists(em: EntityManager, id: string, res: Response): Promise<Question | undefined> {
  return _ensureEntityExists(em, Question, id, res);
}
