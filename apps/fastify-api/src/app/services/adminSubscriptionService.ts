import { EntityManager } from '@mikro-orm/core';
import { EntityRepository } from "@mikro-orm/sqlite";
import { Subscription } from '../../modules/subscription/subscription.entity.js'
import { User } from '../../modules/user/user.entity.js'

export class AdminSubscriptionService {
  constructor(private em: EntityManager, private userCtx: EntityRepository<User>, private subscriptionCtx: EntityRepository<Subscription>) {}

  async getSubscriptionsAsync() {
    return await this.subscriptionCtx.find({}, { populate: ['user', 'approvedBy', 'revokedBy'] });
  }
  async getSubscriptionByIdAsync(subscriptionId: number) {
    return await this.subscriptionCtx.findOne({ id: subscriptionId }, { populate: ['user', 'approvedBy', 'revokedBy'] });
  }
  async approveSubscriptionAsync(subscriptionId: number, approvedBy: number) {
    return await this.em.transactional(async (em) => {
      try {
        const subscription = await this.subscriptionCtx.findOne({ id: subscriptionId });
        if (!subscription) {
          throw new Error('Subscription not found');
        }

        const adminUser = await this.userCtx.findOne({ id: approvedBy });
        if (!adminUser || !adminUser.isAdmin) {
          throw new Error('Unauthorized');
        }

        subscription.approve(adminUser);
        await em.persistAndFlush(subscription);

        return subscription;
      } catch (error) {
        await em.rollback();
        throw error;
      }
    });
  }
  async revokeSubscriptionAsync(subscriptionId: number, revokedBy: number) {
    return await this.em.transactional(async (em) => {
      try {
        const subscription = await this.subscriptionCtx.findOne({ id: subscriptionId });
        if (!subscription) {
          throw new Error('Subscription not found');
        }

        const adminUser = await this.userCtx.findOne({ id: revokedBy });
        if (!adminUser || !adminUser.isAdmin) {
          throw new Error('Unauthorized');
        }

        subscription.revoke(adminUser);
        await em.persistAndFlush(subscription);

        return subscription;
      } catch (error) {
        await em.rollback();
        throw error;
      }
    });
  }
}
