import { Entity, Property, OneToOne, Ref, ManyToOne, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { Quiz } from '../quiz/quiz.entity.js';
import { Wizard } from '../wizard/wizard.entity.js';
import { Wand } from '../wand/wand.entity.js';

@Entity()
export class Answer extends BaseEntity {
  @Property({ nullable: false, type: Date })
  created_at!: Date;

  @Property({ nullable: false })
  score!: number;

  @ManyToOne(() => Quiz, { nullable: false })
  quiz!: Rel<Quiz>;

  @ManyToOne(() => Wizard, { nullable: false })
  wizard!: Rel<Wizard>;

  @ManyToOne(() => Wand, { nullable: false })
  wand!: Rel<Wand>;
}
