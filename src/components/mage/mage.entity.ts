import { Entity, Property, Collection, OneToMany, Cascade } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/baseEntity.entity.js';

@Entity()
export class Mage extends BaseEntity {
  @Property({ nullable: false })
  username!: string;

  @Property({ nullable: false })
  password!: string;

  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  last_name!: string;

  @Property({ unique: true, nullable: false })
  email!: string;

  @Property({ nullable: false })
  address!: string;

  @Property({ nullable: false })
  phone!: string;

  @Property({ nullable: false })
  role!: string;

  // Faltan las relaciones con las otras entidades
}
