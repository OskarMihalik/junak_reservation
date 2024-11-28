import { initContract, type RouterOptions } from '@ts-rest/core'
import { z } from 'zod'
import {
  zErrorDto,
  zRequestSubscriptionDto,
  zResponseSubscriptionDto,
} from '@workspace/data'
import { SUBSCRIPTIONS_CONTRACT_PATH_PREFIX } from '../constants.js'

const c = initContract()

const routerOptions: RouterOptions<typeof SUBSCRIPTIONS_CONTRACT_PATH_PREFIX> = {
  pathPrefix: SUBSCRIPTIONS_CONTRACT_PATH_PREFIX,
  strictStatusCodes: true,
}

export const apiSubscriptionContract = c.router(
  {
    getUserSubscriptionsAsync: {
      method: 'GET',
      path: '',
      responses: {
        200: zResponseSubscriptionDto.array(),
        400: zErrorDto,
        401: zErrorDto,
      },
      summary: 'Get subscriptions of authenticated user',
    },
    orderSubscriptionAsync: {
      method: 'POST',
      path: '/pay',
      body: zRequestSubscriptionDto,
      responses: {
        200: z.string(),
        400: zErrorDto,
        401: zErrorDto,
      },
      summary: 'Order and generate variable symbol for subscription payment',
    },
  },
  routerOptions,
)
