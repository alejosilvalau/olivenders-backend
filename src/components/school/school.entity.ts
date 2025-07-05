import { Entity, Property, Collection, OneToMany, Cascade } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { Wizard } from '../wizard/wizard.entity.js';

@Entity()
export class School extends BaseEntity {
  @Property({ nullable: false, unique: true })
  name!: string;

  @Property({ nullable: false, unique: true })
  email!: string;

  @Property({ nullable: false })
  address!: string;

  @Property({ nullable: false })
  phone!: string;

  @OneToMany(() => Wizard, wizard => wizard.school, { nullable: true, cascade: [Cascade.REMOVE] })
  wizards = new Collection<Wizard>(this);
}
