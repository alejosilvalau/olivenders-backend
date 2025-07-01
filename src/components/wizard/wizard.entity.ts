import { Entity, Property, ManyToOne, Cascade, Ref } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/baseEntity.entity.js';
import { School } from '../school/school.entity.js';

@Entity()
export class Wizard extends BaseEntity {
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

  @ManyToOne(() => School, { nullable: false, cascade: [Cascade.PERSIST] })
  school!: Ref<School>;
}
