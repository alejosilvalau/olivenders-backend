import { Entity, Property, ManyToOne, Cascade, Ref, Rel, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { School } from '../school/school.entity.js';
import { Order } from '../order/order.entity.js';
import { Answer } from '../answer/answer.entity.js';

export enum WizardSchemas {
  Wizard = 'Wizard',
  WizardRequest = 'WizardRequest',
  WizardLoginRequest = 'WizardLoginRequest',
  WizardPasswordRequest = 'WizardPasswordRequest',
  WizardResponse = 'WizardResponse',
  WizardBooleanResponse = 'WizardBooleanResponse',
}

export const wizardSchemas = {
  [WizardSchemas.Wizard]: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      username: { type: 'string' },
      password: { type: 'string' },
      name: { type: 'string' },
      last_name: { type: 'string' },
      email: { type: 'string' },
      address: { type: 'string' },
      phone: { type: 'string' },
      role: {
        type: 'string',
        enum: ['admin', 'user'],
      },
      deactivated: { type: 'boolean' },
      school: { type: 'string' },
    },
    required: [
      'id',
      'username',
      'password',
      'name',
      'last_name',
      'email',
      'address',
      'phone',
      'role',
      'deactivated',
      'school',
    ],
  },

  [WizardSchemas.WizardRequest]: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
      name: { type: 'string' },
      last_name: { type: 'string' },
      email: { type: 'string' },
      address: { type: 'string' },
      phone: { type: 'string' },
      school: { type: 'string' },
    },
    required: ['username', 'password', 'name', 'last_name', 'email', 'address', 'phone', 'school'],
  },

  [WizardSchemas.WizardLoginRequest]: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['username', 'password'],
  },

  [WizardSchemas.WizardPasswordRequest]: {
    type: 'object',
    properties: {
      password: { type: 'string' },
    },
    required: ['password'],
  },

  [WizardSchemas.WizardResponse]: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      username: { type: 'string' },
      name: { type: 'string' },
      last_name: { type: 'string' },
      email: { type: 'string' },
      address: { type: 'string' },
      phone: { type: 'string' },
      role: {
        type: 'string',
        enum: ['admin', 'user'],
      },
      deactivated: { type: 'boolean' },
      school: { type: 'string' },
    },
    required: ['id', 'username', 'name', 'last_name', 'email', 'address', 'phone', 'role', 'deactivated', 'school'],
  },

  [WizardSchemas.WizardBooleanResponse]: {
    type: 'boolean',
  },
};

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
