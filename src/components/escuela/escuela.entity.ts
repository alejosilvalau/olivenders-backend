import { Entity, Property, Collection, OneToMany, Cascade } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/baseEntity.entity.js';

@Entity()
export class Escuela extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  email!: string;

  @Property({ nullable: false })
  direccion!: string;

  @Property({ nullable: false })
  telefono!: string;

  // @OneToMany(() => Mago, mago => mago.escuela, { nullable: true, cascade: [Cascade.ALL] })
  // usuarios = new Collection<Mago>(this);
}
