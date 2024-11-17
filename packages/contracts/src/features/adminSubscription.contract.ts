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
      path: '/approve/:id',
      body: null,
      responses: {
        200: zResponseSubscriptionDto,
        400: zErrorDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Approve subscription',
    },
    revokeSubscription: {
      method: 'POST',
      path: '/revoke/:id',
      body: null,
      responses: {
        200: zResponseSubscriptionDto,
        400: zErrorDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Revoke subscription',
    },
  },
  routerOptions,
)
