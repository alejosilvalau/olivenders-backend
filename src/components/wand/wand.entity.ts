import { Entity, Property, ManyToOne, Cascade, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import Wood from '../wood/wood.entity.js';
import { Core } from '../core/core.entity.js';

@Entity()
export class Wand extends BaseEntity {
  @Property({ nullable: false, unique: true })
  name!: string;

  @Property({ nullable: false })
  length!: number;

  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  status!: string;

  @Property({ nullable: false })
  image!: string;

  @Property({ nullable: false })
  profit_margin!: number;

  @Property({ nullable: false })
  total_price!: number;

  @ManyToOne(() => Wood, { nullable: false })
  wood!: Rel<Wood>;

  @ManyToOne(() => Core, { nullable: false })
  core!: Rel<Core>;
}
