import { initContract, type RouterOptions } from '@ts-rest/core'
import { z } from 'zod'
import {
  zErrorDto,
  zRequestSubscriptionDto,
  zResponseSubscriptionDto
} from '@workspace/data'
import { SUBSCRIPTIONS_CONTRACT_PATH_PREFIX } from "../constants.js";

const c = initContract()

const routerOptions: RouterOptions<typeof SUBSCRIPTIONS_CONTRACT_PATH_PREFIX> = {
  pathPrefix: SUBSCRIPTIONS_CONTRACT_PATH_PREFIX,
  strictStatusCodes: true,
}

export const apiSubscriptionContract = c.router(
  {
    getAllSubscriptions: {
      method: 'GET',
      path: '/',
      responses: {
        200: zResponseSubscriptionDto.array(),
        400: zErrorDto,
        401: zErrorDto,
      },
      summary: 'Get all subscriptions',
    },
    getSubscription: {
      method: 'GET',
      path: '/:id',
      responses: {
        200: zResponseSubscriptionDto,
        400: zErrorDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Get a specific subscription',
    },
    approveSubscription: {
      method: 'POST',
      path: '/pay',
      body: zRequestSubscriptionDto,
      responses: {
        200: zResponseSubscriptionDto,
        400: zErrorDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Generate variable symbol for payment',
    },
  },
  routerOptions,
)
