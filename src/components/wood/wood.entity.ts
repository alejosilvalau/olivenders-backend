import { Entity, Property, ManyToOne, Cascade, Ref } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

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
}

export default Wood;