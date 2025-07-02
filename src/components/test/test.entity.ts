import { Entity, Property, Collection, OneToMany, Cascade, types } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

@Entity()
export class Test extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false, type: types.date })
  date!: Date;
}
