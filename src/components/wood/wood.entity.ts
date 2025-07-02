import { Entity, Property, ManyToOne, Cascade, Ref } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';


@Entity()
export class Wood extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  binomial_name!: string;

  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  price!: number;

  
}