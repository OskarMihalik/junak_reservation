import { initServer } from '@ts-rest/fastify'
import {initORM} from "../db.js";
import type {FastifyInstance} from "fastify";
import {apiContract} from "@workspace/contracts";
import {Subscription} from "../../modules/subscription/subscription.entity.js";
import {mapSubscriptionToDto} from "../../modules/subscription/subscription.mapper.js";
import {generateVariableSymbol} from "../services/subscriptionService.js";
import {User} from "../../modules/user/user.entity.js";

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

        if (subscription == null){
          return {
            status: 400,
            body: {
              message: 'Subscription not found',
            },
          };
        }

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
        const userDto= request.request.user;
        const user = await db.orm.em.findOne(User, { id: userDto.id });
        if (user == null){
          return {
            status: 400,
            body: {
              message: 'User not found',
            }
          };
        }

        const body = request.body;

        const variableSymbol = generateVariableSymbol(user.aisId, body.subscriptionPeriod);
        const subscription = new Subscription(user, variableSymbol, body.subscriptionPeriod);


        const subscriptionCmd = db.subscriptionCtx.create(subscription);
        await db.subscriptionCtx.insert(subscriptionCmd);

        const subscriptionDto = mapSubscriptionToDto(subscription)

        return {
          status: 200,
          body: subscriptionDto,
        }
      },
    },
  }),
})
