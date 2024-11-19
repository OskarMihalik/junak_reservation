import { initContract, type RouterOptions } from '@ts-rest/core'
import { apiHelloContract } from './features/hello.contract.js'
import { API_PATH_PREFIX } from './constants.js'
import { apiUserContract } from './features/user.contract.js'
import { apiAdminScheduleContract } from './features/adminSchedule.contract.js'
import { apiAdminSubscriptionContract } from './features/adminSubscription.contract.js'
import { apiScheduleContract } from './features/schedule.contract.js'
import { apiSubscriptionContract } from './features/subscription.contract.js'

const c = initContract()

const routerOptions: RouterOptions<typeof API_PATH_PREFIX> = {
  strictStatusCodes: true,
  pathPrefix: API_PATH_PREFIX,

  // uncomment the following example to require headers for every request
  // baseHeaders: z.object({ ... })
}

export const apiContract = c.router(
  {
    hello: apiHelloContract,
    user: apiUserContract,
    adminSchedule: apiAdminScheduleContract,
    schedule: apiScheduleContract,
    // adminSubscription: apiAdminSubscriptionContract,
    // subscription: apiSubscriptionContract,
  },
  routerOptions,
)
