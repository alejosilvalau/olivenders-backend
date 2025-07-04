import { Entity, Property, Cascade, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { Wand } from '../wand/wand.entity.js';

@Entity()
class Wood extends BaseEntity {
  @Property({ nullable: false, unique: true })
  name!: string;

  @Property({ nullable: false, unique: true })
  binomial_name!: string;

  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  price!: number;

  @OneToMany(() => Wand, wand => wand.wood, { cascade: [Cascade.REMOVE] })
  wands = new Collection<Wand>(this);
}

export default Wood;
