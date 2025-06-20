import { Entity, Property, ManyToOne } from '@mikro-orm/core';

@Entity()
export class Wand {
  @Property()
  name!: string;

  // otras propiedades...
}
