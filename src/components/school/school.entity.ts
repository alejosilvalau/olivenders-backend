import { Entity, Property, Collection, OneToMany, Cascade } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/baseEntity.entity.js';
import { Mage } from '../mage/mage.entity.js';

@Entity()
export class School extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  email!: string;

  @Property({ nullable: false })
  address!: string;

  @Property({ nullable: false })
  phone!: string;

  @OneToMany(() => Mage, mage => mage.school, { nullable: true, cascade: [Cascade.REMOVE] })
  mages = new Collection<Mage>(this);
}
