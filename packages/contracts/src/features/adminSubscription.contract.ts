import { initContract, type RouterOptions } from '@ts-rest/core'
import { z } from 'zod'
import {
  zErrorDto,
  zResponseSubscriptionDto
} from '@workspace/data'
import { ADMIN_SUBSCRIPTIONS_CONTRACT_PATH_PREFIX } from "../constants.js";

const c = initContract()

const routerOptions: RouterOptions<typeof ADMIN_SUBSCRIPTIONS_CONTRACT_PATH_PREFIX> = {
  pathPrefix: ADMIN_SUBSCRIPTIONS_CONTRACT_PATH_PREFIX,
  strictStatusCodes: true,
}

export const apiAdminSubscriptionContract = c.router(
  {
    getSubscriptionsAsync: {
      method: 'GET',
      path: '',
      responses: {
        200: zResponseSubscriptionDto.array(),
        400: zErrorDto,
        401: zErrorDto,
      },
      summary: 'Get all subscriptions',
    },
    getSubscriptionByIdAsync: {
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
    approveSubscriptionAsync: {
      method: 'POST',
      path: '/approve/:id',
      body: null,
      responses: {
        200: z.string(),
        400: zErrorDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Approve subscription',
    },
    revokeSubscriptionAsync: {
      method: 'POST',
      path: '/revoke/:id',
      body: null,
      responses: {
        200: z.string(),
        400: zErrorDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Revoke subscription',
    },
  },
  routerOptions,
)
