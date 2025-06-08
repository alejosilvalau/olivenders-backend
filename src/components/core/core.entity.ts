// core.entity.ts
import { Entity, Property, OneToOne, Ref } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/baseEntity.entity.js';
import { Wand} from '../wand/wand.entity.js';

@Entity()
export class Core extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  price!: number;

  @OneToOne(() => Wand, { nullable: false}) // Nucleo tiene una varita obligatoriamente
  wand!: Ref<Wand>;
}
