import { initServer } from '@ts-rest/fastify'
import {initORM} from "../db";
import type {FastifyInstance} from "fastify";
import {apiContract} from "@workspace/contracts";
import {Subscription} from "../../modules/subscription/subscription.entity";
import {mapSubscriptionToDto} from "../../modules/subscription/subscription.mapper";
import { zResponseSubscriptionDto } from "@workspace/data";
import {generateVariableSymbol} from "../services/subscriptionService";
import {User} from "../../modules/user/user.entity";

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


        const subscriptionCmd = db.subscription.create(subscription);
        await db.subscription.insert(subscriptionCmd);

        const subscriptionDto = mapSubscriptionToDto(subscription)
        // const parsedSubscription = zResponseSubscriptionDto.parse(subscription)

        return {
          status: 200,
          body: subscriptionDto,
        }
      },
    },
  }),
})
