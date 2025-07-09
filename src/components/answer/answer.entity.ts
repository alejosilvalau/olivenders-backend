import { Entity, Property, OneToOne, Ref } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

@Entity()
export class Answer extends BaseEntity {
  @Property({ nullable: false, type: Date })
  created_at!: Date;

  @Property({ nullable: false })
  score!: number;

  //TODO: Relationship with quiz, wand and wizard
}
