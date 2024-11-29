// apps/fastify-api/src/utils/subscriptionValidator.ts
import { Subscription, SubscriptionStatus } from '../../modules/subscription/subscription.entity.js'
import { initORM } from '../db.js';

const INTERVAL_DURATION = 15 * 60 * 1000;

export class SubscriptionValidator {
  static async checkAndExpireSubscriptionsAsync(): Promise<void> {
    const { em } = await initORM();

    setInterval(async () => {
      const now = new Date();
      const emFork = em.fork(); // Create a new forked EntityManager instance

      try {
        // Fetch all subscriptions that match the condition
        const subscriptions = await emFork.find(Subscription, {
          status: SubscriptionStatus.APPROVED,
          expiresAt: { $lte: now },
        });

        // Perform a bulk update for those records
        await emFork.transactional(async (em) => {
          await em.nativeUpdate(
            Subscription,
            { id: { $in: subscriptions.map(sub => sub.id) } },
            { status: SubscriptionStatus.EXPIRED }
          );
        });
      } catch (error) {
        console.error('Error expiring subscriptions:', error);
      }
    }, INTERVAL_DURATION);
  }
}
