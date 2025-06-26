import { Entity, Property, ManyToOne, Cascade, Ref } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/baseEntity.entity.js';


@Entity()
export class Wand extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  email!: string;

  @Property({ nullable: false })
  length!: string;

  @Property({ nullable: false })
  flexibility!: string;

  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  state!: string;

  @Property({ nullable: false })
  image!: string;

  @Property({ nullable: false })
  profit_margin!: number;

  @Property({ nullable: false })
  total_price!: number;
}