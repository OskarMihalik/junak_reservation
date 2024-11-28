import { initServer } from '@ts-rest/fastify'
import { initORM } from '../db.js'
import type { FastifyInstance } from 'fastify'
import { AdminSubscriptionService } from '../services/adminSubscriptionService.js'
import { apiAdminSubscriptionContract } from '@workspace/contracts/src/features/adminSubscription.contract.js'
import { mapSubscriptionToDto } from '../../modules/subscription/subscription.mapper.js'

const s = initServer()
const { em, userCtx, subscriptionCtx } = await initORM()
const adminSubscriptionService = new AdminSubscriptionService(em, userCtx, subscriptionCtx);

export const adminSubscriptionContractRouter = (app: FastifyInstance) => ({
  routes: s.router(apiAdminSubscriptionContract, {
    getSubscriptionsAsync: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        const userId = request.request.user.id;
        const user = await userCtx.findOne({ id : userId });

        if(!user || !(user.isAdmin))
          return {
            status: 401,
            body: { message: 'Unauthorized' },
          };

        const subscriptions = await adminSubscriptionService.getSubscriptionsAsync();

        return {
          status: 200,
          body: subscriptions.map(subscription => mapSubscriptionToDto(subscription)),
        };
      },
    },
    getSubscriptionByIdAsync: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        const userId = request.request.user.id;
        const user = await userCtx.findOne({ id : userId});

        if(!user || !(user.isAdmin))
          return {
            status: 401,
            body: { message: 'Unauthorized' },
          };

        const { id } = request.params;
        const subscription = await adminSubscriptionService.getSubscriptionByIdAsync(parseInt(id));

        if (!subscription) {
          return {
            status: 404,
            body: { message: 'Schedule not found' },
          };
        }

        return {
          status: 200,
          body: mapSubscriptionToDto(subscription),
        };
      },
    },
    approveSubscriptionAsync: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        const userId = request.request.user.id;
        const user = await userCtx.findOne({ id : userId});

        if(!user || !(user.isAdmin))
          return {
            status: 401,
            body: { message: 'Unauthorized' },
          };

        const { id } = request.params;
        var subscription = await subscriptionCtx.findOne({ id: parseInt(id) });
        if (!subscription) {
          return {
            status: 404,
            body: { message: 'Subscription not found' },
          };
        }

        await adminSubscriptionService.approveSubscriptionAsync(subscription.id, user.id);

        return {
          status: 200,
          body: "Subscription approved",
        };
      },
    },
    revokeSubscriptionAsync: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        const userId = request.request.user.id;
        const user = await userCtx.findOne({ id : userId});

        if(!user || !(user.isAdmin))
          return {
            status: 401,
            body: { message: 'Unauthorized' },
          };

        const { id } = request.params;
        var subscription = await subscriptionCtx.findOne({ id: parseInt(id) });
        if (!subscription) {
          return {
            status: 404,
            body: { message: 'Subscription not found' },
          };
        }

        await adminSubscriptionService.revokeSubscriptionAsync(subscription.id, user.id);

        return {
          status: 200,
          body: "Subscription revoked",
        };
      },
    },
  }),
})
