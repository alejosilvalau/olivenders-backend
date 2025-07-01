import { Entity, Property, Collection, OneToMany, Cascade, types } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/baseEntity.entity.js';

@Entity()
export class Sale extends BaseEntity {
  @Property({ nullable: false })
  payment_id!: number;

  @Property({ nullable: false, type: types.date })
  date!: Date;

  @Property({ nullable: false })
  status!: string;

  @Property({ nullable: false })
  review!: string;
}
