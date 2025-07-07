import { Entity, Property, ManyToOne, Cascade, Ref } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

@Entity()
export class Question extends BaseEntity {
  @Property({ nullable: false })
  question!: string;

  @Property({ nullable: false })
  created_at?: Date;
}
