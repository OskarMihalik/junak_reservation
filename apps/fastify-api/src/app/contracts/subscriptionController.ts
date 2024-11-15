import { initServer } from '@ts-rest/fastify'
import {initORM} from "../db";
import type {FastifyInstance} from "fastify";
import {apiContract} from "@workspace/contracts";
import {Subscription} from "../../modules/subscription/subscription.entity";
import {mapSubscriptionToDto} from "../../modules/subscription/subscription.mapper";
import {zRequestSubscriptionDto, zResponseSubscriptionDto} from "@workspace/data";
import {generateVariableSymbol} from "../services/subscriptionService";

const s = initServer()
const db = await initORM()

export const subscriptionContractRouter = (app: FastifyInstance) => ({
  routes: s.router(apiContract.subscription, {
    getAllSubscriptions: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async () => {
        const subscriptions = await db.orm.em.find(Subscription, {});
        const subscriptionsDto = subscriptions.map(mapSubscriptionToDto);

        return {
          status: 200,
          body: subscriptionsDto,
        }
      },
    },
    getSubscription: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        const {id} = request.params;

        const subscription = await db.orm.em.findOne(Subscription, {id: parseInt(id)});
        const subscriptionDto = mapSubscriptionToDto(subscription as Subscription);

        return {
          status: 200,
          body: subscriptionDto,
        }
      },
    },
    approveSubscription: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        const user= request.request.user

        const body = request.body;

        const subscription = new Subscription();
        subscription.subscriptionPeriod = body.subscriptionPeriod;
        subscription.variableSymbol = generateVariableSymbol(user.aisId, subscription.subscriptionPeriod);

        const subscriptionCmd = db.subscription.create(subscription);
        await db.subscription.insert(subscriptionCmd);

        const parsedSubscription = zResponseSubscriptionDto.parse(subscription)

        return {
          status: 200,
          body: parsedSubscription,
        }
      },
    },
  }),
})
