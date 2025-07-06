import { Entity, Property, ManyToOne, Cascade, Ref, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { School } from '../school/school.entity.js';

export enum WizardRole {
  Admin = 'admin',
  Wizard = 'wizard',
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
}
