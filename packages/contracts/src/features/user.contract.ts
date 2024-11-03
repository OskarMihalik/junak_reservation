import { initContract, type RouterOptions } from '@ts-rest/core'
import { z } from 'zod'
import { zHelloDto, zUserDto, zUuidParams } from '@workspace/data'
import { USER_CONTRACT_PATH_PREFIX } from '../constants'

const c = initContract()

const routerOptions: RouterOptions<typeof USER_CONTRACT_PATH_PREFIX> = {
  pathPrefix: USER_CONTRACT_PATH_PREFIX,
  strictStatusCodes: true,
}

export const apiUserContract = c.router(
  {
    getUser: {
      method: 'GET',
      path: '/',
      responses: {
        200: zUserDto.array(),
        404: z.null(),
      },
      query: null,
      summary: 'Get a user',
      metadata: { roles: ['guest', 'user'] } as const,
    },
  },
  routerOptions,
)
