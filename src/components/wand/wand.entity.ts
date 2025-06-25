import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/baseEntity.entity.js';

@Entity()
export class Wand extends BaseEntity {
  @Property()
  name!: string;

  // otras propiedades...
}
