import { initContract, type RouterOptions } from '@ts-rest/core'
import { z } from 'zod'
import {
  zErrorDto,
  zHelloDto,
  zLoginUserDto,
  zRegisterUserDto,
  zRegisterUserResponseDto,
  zTokenDto,
  zUserDto,
  zUuidParams,
} from '@workspace/data'
import { USER_CONTRACT_PATH_PREFIX } from '../constants'
import { register } from 'module'

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
        401: zErrorDto,
      },
      summary: 'Get a user',
    },
    registerUser: {
      method: 'POST',
      path: '/register',
      body: zRegisterUserDto,
      responses: {
        201: zRegisterUserResponseDto,
      },
    },
    loginUser: {
      method: 'POST',
      path: '/login',
      body: zLoginUserDto,
      responses: {
        200: zTokenDto,
        401: zErrorDto,
      },
    },
    logoutUser: {
      method: 'DELETE',
      path: '/logout',
      responses: {
        200: z.null(),
        401: zErrorDto,
      },
    },
  },
  routerOptions,
)
