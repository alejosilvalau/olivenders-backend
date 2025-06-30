import { Entity, Property, Collection, OneToMany, Cascade } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/baseEntity.entity.js';

@Entity()
export class Test extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  date!: string;
}
