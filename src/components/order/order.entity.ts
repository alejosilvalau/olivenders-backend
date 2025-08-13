import { Entity, Property, ManyToOne, Rel, OneToOne } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { Wizard } from '../wizard/wizard.entity.js';
import { Wand } from '../wand/wand.entity.js';

export enum OrderSchemas {
  Order = 'Order',
  OrderRequest = 'OrderRequest',
  OrderReviewRequest = 'OrderReviewRequest',
}

export const orderSchemas = {
  [OrderSchemas.Order]: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      payment_reference: { type: 'string' },
      payment_provider: {
        type: 'string',
        enum: ['stripe', 'paypal', 'wire_transfer', 'credit_card', 'debit_card'],
      },
      shipping_address: { type: 'string' },
      tracking_id: { type: 'string' },
      created_at: { type: 'string', format: 'date-time' },
      status: {
        type: 'string',
        enum: ['pending', 'paid', 'dispatched', 'delivered', 'completed', 'cancelled', 'refunded'],
      },
      completed: { type: 'boolean' },
      review: { type: 'string' },
      wizard: { type: 'string' },
      wand: { type: 'string' },
    },
    required: ['id', 'payment_reference', 'payment_provider', 'shipping_address', 'wizard', 'wand'],
  },

  [OrderSchemas.OrderRequest]: {
    type: 'object',
    properties: {
      payment_reference: { type: 'string' },
      payment_provider: {
        type: 'string',
        enum: ['stripe', 'paypal', 'wire_transfer', 'credit_card', 'debit_card'],
      },
      shipping_address: { type: 'string' },
      wizard: { type: 'string' },
      wand: { type: 'string' },
    },
    required: ['payment_reference', 'payment_provider', 'shipping_address', 'wizard', 'wand'],
  },

  [OrderSchemas.OrderReviewRequest]: {
    type: 'object',
    properties: {
      review: { type: 'string' },
    },
    required: ['review'],
  },
};

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

  @Property({ nullable: false })
  shipping_address!: string;

  @Property({ nullable: true })
  tracking_id!: string;

  @Property({ nullable: false, type: Date })
  created_at!: Date;

  @Property({ nullable: false })
  status!: OrderStatus;

  @Property({ nullable: false })
  completed!: boolean;

  @Property({ nullable: true })
  review?: string;

  @ManyToOne(() => Wizard, { nullable: false })
  wizard!: Rel<Wizard>;

  @OneToOne(() => Wand, wand => wand.order, {
    nullable: false,
    unique: true,
    owner: true,
  })
  wand!: Rel<Wand>;
}
