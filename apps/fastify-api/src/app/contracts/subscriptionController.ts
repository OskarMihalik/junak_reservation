import { initServer } from '@ts-rest/fastify'
import { initORM } from '../db.js'
import type { FastifyInstance } from 'fastify'
import { mapSubscriptionToDto } from '../../modules/subscription/subscription.mapper.js'
import { SubscriptionService } from '../services/subscriptionService.js'
import { apiSubscriptionContract } from '@workspace/contracts/src/features/subscription.contract.js'
import { zRequestSubscriptionDto } from '@workspace/data'

const s = initServer()
const { em, userCtx, subscriptionCtx } = await initORM()
const subscriptionService = new SubscriptionService(em, userCtx, subscriptionCtx);

export const subscriptionContractRouter = (app: FastifyInstance) => ({
  routes: s.router(apiSubscriptionContract, {
    getUserSubscriptionsAsync: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        const userId = request.request.user.id
        const user = await userCtx.findOne({ id: userId })

        if(!user)
          return {
            status: 404,
            body: { message: 'User not found' },
          };
        console.log("WEEE");

        const subscriptions = await subscriptionService.getUserSubscriptionsAsync(user.id);
        console.log(subscriptions);
        return {
          status: 200,
          body: subscriptions.map(subscription => mapSubscriptionToDto(subscription)),
        }
      },
    },
    orderSubscriptionAsync: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        const userId = request.request.user.id
        const user = await userCtx.findOne({ id: userId })

        if(!user)
          return {
            status: 404,
            body: { message: 'User not found' },
          };

        const subscriptionData = zRequestSubscriptionDto.parse(request.body);
        const subscription = await subscriptionService.orderSubscriptionAsync(user.id, user.aisId, subscriptionData.subscriptionPeriod);

        return {
          status: 200,
          body: "Subscription ordered",
        }
      },
    },
  }),
})
