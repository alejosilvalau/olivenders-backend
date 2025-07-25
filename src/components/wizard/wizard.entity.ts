import { Entity, Property, ManyToOne, Cascade, Ref, Rel, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { School } from '../school/school.entity.js';
import { Order } from '../order/order.entity.js';
import { Answer } from '../answer/answer.entity.js';

export enum WizardRole {
  Admin = 'admin',
  User = 'user',
}

@Entity()
export class Wizard extends BaseEntity {
  @Property({ nullable: false, unique: true })
  username!: string;

  @Property({ nullable: false })
  password!: string;

  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  last_name!: string;

  @Property({ nullable: false, unique: true })
  email!: string;

  @Property({ nullable: false })
  address!: string;

  @Property({ nullable: false })
  phone!: string;

  @Property({ nullable: false })
  role!: WizardRole;

  @Property({ nullable: false })
  deactivated!: boolean;

  @ManyToOne(() => School, { nullable: false })
  school!: Rel<School>;

  @OneToMany(() => Order, order => order.wizard, { cascade: [Cascade.REMOVE] })
  orders = new Collection<Order>(this);

  @OneToMany(() => Answer, answer => answer.wizard, { cascade: [Cascade.REMOVE] })
  answers = new Collection<Answer>(this);
}
