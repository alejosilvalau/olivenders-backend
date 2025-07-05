import { Entity, Property, OneToOne, Ref, OneToMany, Cascade, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { Wand } from '../wand/wand.entity.js';

@Entity()
export class Core extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  price!: number;

  @OneToMany(() => Wand, wand => wand.core, { cascade: [Cascade.REMOVE] })
  wands = new Collection<Wand>(this);
}
