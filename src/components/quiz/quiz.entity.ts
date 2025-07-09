import { Entity, Property, Collection, OneToMany, Cascade, types, DateTimeType, ManyToMany } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { Question } from '../question/question.entity.js';

@Entity()
export class Quiz extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false, type: Date })
  created_at!: Date;

  @ManyToMany(() => Question, question => question.quizzes, {
    owner: true,
  })
  questions = new Collection<Question>(this);
}
