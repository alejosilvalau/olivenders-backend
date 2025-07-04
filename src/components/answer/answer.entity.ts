import { Entity, Property, OneToOne, Ref } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

@Entity()
export class Answer extends BaseEntity {}
