import { Entity, Property, ManyToOne, Cascade, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import Wood from '../wood/wood.entity.js';
import { Core } from '../core/core.entity.js';

export enum WandStatus {
  Available = 'available',
  Sold = 'sold',
  Deactivated = 'deactivated',
}
@Entity()
export class Wand extends BaseEntity {
  @Property({ nullable: false, unique: true })
  name!: string;

  @Property({ nullable: false })
  length_inches!: number;

  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  status!: WandStatus;

  @Property({ nullable: false })
  image!: string;

  @Property({ nullable: false })
  profit!: number;

  @Property({ nullable: false })
  total_price!: number;

  @ManyToOne(() => Wood, { nullable: false })
  wood!: Rel<Wood>;

  @ManyToOne(() => Core, { nullable: false })
  core!: Rel<Core>;
}
