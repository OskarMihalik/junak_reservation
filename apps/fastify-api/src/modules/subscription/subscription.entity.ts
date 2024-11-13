import { Entity, PrimaryKey, Property, Enum, ManyToOne } from '@mikro-orm/core';
import { User } from '../user/user.entity'; // Adjust the import path as necessary

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

  @Property({ nullable: true })
  approvedBy?: number;

  @Property({ nullable: true })
  expiresAt?: Date;

  @Property({ nullable: true })
  revokedAt?: Date;

  @Property({ nullable: true })
  revokedBy?: number;
}
