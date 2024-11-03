import { initContract, type RouterOptions } from '@ts-rest/core'
import { apiHelloContract } from './features/hello.contract'
import { API_PATH_PREFIX } from './constants'
import { apiUserContract } from './features/user.contract'

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
  },
  routerOptions,
)
