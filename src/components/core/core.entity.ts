import { Entity, Property, OneToOne, Ref, OneToMany, Cascade, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { Wand } from '../wand/wand.entity.js';

export const coreSchemas = {
  Core: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' },
    },
    required: ['id', 'name', 'description', 'price'],
  },

  CoreRequest: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' },
    },
    required: ['name', 'description', 'price'],
  },
};

export enum CoreSchemas {
  Core = 'Core',
  CoreRequest = 'CoreRequest',
}

@Entity()
export class Core extends BaseEntity {
  @Property({ nullable: false, unique: true })
  name!: string;

  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  price!: number;

  @OneToMany(() => Wand, wand => wand.core, { cascade: [Cascade.REMOVE] })
  wands = new Collection<Wand>(this);
}
