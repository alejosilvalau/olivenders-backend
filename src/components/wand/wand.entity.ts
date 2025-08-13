import { Entity, Property, ManyToOne, Cascade, Rel, OneToOne, Collection, OneToMany } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { Wood } from '../wood/wood.entity.js';
import { Core } from '../core/core.entity.js';
import { Order } from '../order/order.entity.js';
import { Answer } from '../answer/answer.entity.js';

export enum WandSchemas {
  Wand = 'Wand',
  WandRequest = 'WandRequest',
}

export const wandSchemas = {
  [WandSchemas.Wand]: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      length_inches: { type: 'number' },
      description: { type: 'string' },
      status: {
        type: 'string',
        enum: ['available', 'sold', 'deactivated'],
      },
      image: { type: 'string' },
      profit: { type: 'number' },
      total_price: { type: 'number' },
      wood: { type: 'string' },
      core: { type: 'string' },
    },
    required: [
      'id',
      'name',
      'length_inches',
      'description',
      'status',
      'image',
      'profit',
      'total_price',
      'wood',
      'core',
    ],
  },

  [WandSchemas.WandRequest]: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      length_inches: { type: 'number' },
      description: { type: 'string' },
      image: { type: 'string' },
      profit: { type: 'number' },
      wood: { type: 'string' },
      core: { type: 'string' },
    },
    required: ['name', 'length_inches', 'description', 'image', 'profit', 'wood', 'core'],
  },
};


export enum WandStatus {
  Available = 'available',
  Sold = 'sold',
  Deactivated = 'deactivated',
}
@Entity()
export class Wand extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  length_inches!: number;

  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  status!: WandStatus;

  @Property({ nullable: false })
  image!: string;

  @Property({ nullable: false })
  profit!: number;

  @Property({ nullable: false })
  total_price!: number;

  @ManyToOne(() => Wood, { nullable: false })
  wood!: Rel<Wood>;

  @ManyToOne(() => Core, { nullable: false })
  core!: Rel<Core>;

  @OneToOne(() => Order, order => order.wand, {
    nullable: true,
    unique: true,
    cascade: [Cascade.REMOVE],
  })
  order?: Rel<Order>;

  @OneToMany(() => Answer, answer => answer.wand, { cascade: [Cascade.REMOVE] })
  answers = new Collection<Answer>(this);
}
