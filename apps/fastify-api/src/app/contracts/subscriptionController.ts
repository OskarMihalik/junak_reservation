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
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          return {
            status: 401,
            body: {
              message: 'Unauthorized: No token provided'
            },
          };
        }
        // const token = authorizationHeader.split(' ')[1]!;
        // const user = request.request.jwt.verify(token);

        const body = request.body;

        const subscription = new Subscription();
        subscription.subscriptionPeriod = body.subscriptionPeriod;
        subscription.variableSymbol = generateVariableSymbol(subscription.subscriptionPeriod);

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
