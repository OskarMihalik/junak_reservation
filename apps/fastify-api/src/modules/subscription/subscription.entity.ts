import { Entity, PrimaryKey, Property, Enum, ManyToOne } from '@mikro-orm/core';
import { User } from '../user/user.entity.js'

export enum SubscriptionStatus {
  WAITING = 'WAITING',
  APPROVED = 'APPROVED',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED',
}

@Entity()
export class Subscription {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  variableSymbol!: number;

  @Property()
  subscriptionPeriod!: number;

  @Enum(() => SubscriptionStatus)
  status: SubscriptionStatus = SubscriptionStatus.WAITING;

  @Property({ onCreate: () => new Date() })
  generatedAt: Date = new Date();

  @Property({ nullable: true })
  approvedAt?: Date;

  @ManyToOne(() => User, { nullable: true, fieldName: 'approved_by' })
  approvedBy?: User;

  @Property({ nullable: true })
  expiresAt?: Date;

  @Property({ nullable: true })
  revokedAt?: Date;

  @ManyToOne(() => User, { nullable: true, fieldName: 'revoked_by' })
  revokedBy?: User;

  constructor(user: User, variableSymbol: number, subscriptionPeriod: number) {
    this.user = user;
    this.variableSymbol = variableSymbol;
    this.subscriptionPeriod = subscriptionPeriod;
  }

  approve(user: User) {
    this.status = SubscriptionStatus.APPROVED;
    this.approvedAt = new Date();
    this.approvedBy = user;
    this.expiresAt = new Date(Date.now() + this.subscriptionPeriod * 24 * 60 * 60 * 1000);
  }

  revoke(user: User) {
    this.status = SubscriptionStatus.REVOKED;
    this.revokedAt = new Date();
    this.revokedBy = user;
  }
}
