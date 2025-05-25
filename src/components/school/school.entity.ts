import { Entity, Property, Collection, OneToMany, Cascade } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/baseEntity.entity.js';

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

  // @OneToMany(() => Mago, mago => mago.escuela, { nullable: true, cascade: [Cascade.ALL] })
  // usuarios = new Collection<Mago>(this);
}
