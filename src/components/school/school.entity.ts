import { Entity, Property, Collection, OneToMany, Cascade } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { Wizard } from '../wizard/wizard.entity.js';

export enum SchoolSchemas {
  School = 'School',
  SchoolRequest = 'SchoolRequest',
}

export const schoolSchemas = {
  [SchoolSchemas.School]: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' },
      address: { type: 'string' },
      phone: { type: 'string' },
    },
    required: ['id', 'name', 'email', 'address', 'phone'],
  },

  [SchoolSchemas.SchoolRequest]: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
      address: { type: 'string' },
      phone: { type: 'string' },
    },
    required: ['name', 'email', 'address', 'phone'],
  },
};



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
