import { Entity, Property, ManyToOne, Cascade, Ref, ManyToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { Quiz } from '../quiz/quiz.entity.js';

@Entity()
export class Question extends BaseEntity {
  @Property({ nullable: false })
  question!: string;

  @Property({ nullable: false, type: Date })
  created_at?: Date;

  @Property({ nullable: false, type: 'json' })
  options!: string[];

  @ManyToMany(() => Quiz, quiz => quiz.questions, { cascade: [Cascade.REMOVE] })
  quizzes = new Collection<Quiz>(this);
}
