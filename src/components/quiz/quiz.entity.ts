import { Entity, Property, Collection, OneToMany, Cascade, types, DateTimeType } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

@Entity()
export class Quiz extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false, type: DateTimeType })
  date!: DateTimeType;
}
