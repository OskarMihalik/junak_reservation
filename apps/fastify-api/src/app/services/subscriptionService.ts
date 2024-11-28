import { EntityManager } from '@mikro-orm/core'
import { EntityRepository } from '@mikro-orm/sqlite'
import { User } from '../../modules/user/user.entity.js'
import { Subscription } from '../../modules/subscription/subscription.entity.js'


export class SubscriptionService {
  constructor(private em: EntityManager, private userCtx: EntityRepository<User>, private subscriptionCtx: EntityRepository<Subscription>) {}

  async getUserSubscriptionsAsync(userId: number) {
    return await this.subscriptionCtx.find(
      { user: userId },
      { populate: ['user', 'approvedBy', 'revokedBy']}
    );
  }
  async orderSubscriptionAsync(userId: number, aisId: number, subscriptionPeriod: number) {
    return await this.em.transactional(async (em) => {
      try {
        const user = await this.userCtx.findOne({ id: userId });
        if (!user) {
          throw new Error('User not found');
        }

        const vs = this.generateVariableSymbol(aisId, subscriptionPeriod);
        const subscription = new Subscription(user, vs, subscriptionPeriod);
        await em.persistAndFlush(subscription);

        return subscription;
      } catch (error) {
        await em.rollback();
        throw error;
      }
    });
  }
  /**
   * Generates a unique variable symbol for online payments as a positive integer.
   * @param aisID - The AIS ID (5, 6, or 7 digits)
   * @param subscriptionPeriod - Subscription period (1, 3 or 6)
   * @returns A positive integer representing the variable symbol.
   */
  private generateVariableSymbol = (aisID: number, subscriptionPeriod: number): number => {
    const subscriptionPeriodString = subscriptionPeriod.toString()
    const aisIDString = aisID.toString()
    const timestampPartString = (new Date().getFullYear() % 100).toString();

    const variableSymbol = subscriptionPeriodString + timestampPartString + aisIDString;

    return Math.abs(Number(variableSymbol));
  };
}



