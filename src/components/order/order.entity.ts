import { Entity, Property, Collection, OneToMany, Cascade, types, DateTimeType } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

@Entity()
export class Order extends BaseEntity {
  @Property({ nullable: false })
  payment_reference!: string;

  @Property({ nullable: false })
  payment_provider!: string;
  // stripe, paypal, bitcon, ethereum, wire_transfer, credit_card, debit_card

  @Property({ nullable: false, type: DateTimeType })
  date!: DateTimeType;

  @Property({ nullable: false })
  status!: string;
  // pending, paid, dispatched, delivered, completed, cancelled, refunded

  @Property({ nullable: false })
  review!: string;
}
