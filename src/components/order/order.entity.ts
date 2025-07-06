import { Entity, Property, Collection, OneToMany, Cascade, types, DateTimeType } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

export enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid',
  Dispatched = 'dispatched',
  Delivered = 'delivered',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Refunded = 'refunded',
}

export enum PaymentProvider {
  Stripe = 'stripe',
  PayPal = 'paypal',
  WireTransfer = 'wire_transfer',
  CreditCard = 'credit_card',
  DebitCard = 'debit_card',
}

@Entity()
export class Order extends BaseEntity {
  @Property({ nullable: false })
  payment_reference!: string;

  @Property({ nullable: false })
  payment_provider!: PaymentProvider;

  @Property({ nullable: false, type: DateTimeType })
  date!: DateTimeType;

  @Property({ nullable: false })
  status!: OrderStatus;

  @Property({ nullable: false })
  review?: string;
}
