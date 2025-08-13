import { Entity, Property, Cascade, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { Wand } from '../wand/wand.entity.js';

export enum WoodSchemas {
  Wood = 'Wood',
  WoodRequest = 'WoodRequest',
}

export const woodSchemas = {
  [WoodSchemas.Wood]: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      binomial_name: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' },
    },
    required: ['id', 'name', 'binomial_name', 'description', 'price'],
  },

  [WoodSchemas.WoodRequest]: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      binomial_name: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' },
    },
    required: ['name', 'binomial_name', 'description', 'price'],
  },
};

@Entity()
export class Wood extends BaseEntity {
  @Property({ nullable: false, unique: true })
  name!: string;

  @Property({ nullable: false, unique: true })
  binomial_name!: string;

  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  price!: number;

  @OneToMany(() => Wand, wand => wand.wood, { cascade: [Cascade.REMOVE] })
  wands = new Collection<Wand>(this);
}
