import { initContract, type RouterOptions } from '@ts-rest/core'
import { z } from 'zod'
import {
  zErrorDto,
  zLoginUserDto,
  zRegisterUserDto,
  zTokenDto,
  zUserDto,
} from '@workspace/data'
import { USER_CONTRACT_PATH_PREFIX } from '../constants.js'

const c = initContract()

const routerOptions: RouterOptions<typeof USER_CONTRACT_PATH_PREFIX> = {
  pathPrefix: USER_CONTRACT_PATH_PREFIX,
  strictStatusCodes: true,
}

export const apiUserContract = c.router(
  {
    getUsers: {
      method: 'GET',
      path: '',
      responses: {
        200: z.array(zUserDto),
        400: zErrorDto,
        401: zErrorDto,
      },
      summary: 'Get all users',
    },
    getUser: {
      method: 'GET',
      path: '/:id',
      responses: {
        200: zUserDto,
        400: zErrorDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Get a user',
    },
    registerUser: {
      method: 'POST',
      path: '/register',
      body: zRegisterUserDto,
      responses: {
        201: zUserDto,
        400: zErrorDto,
      },
    },
    loginUser: {
      method: 'POST',
      path: '/login',
      body: zLoginUserDto,
      responses: {
        200: zTokenDto,
        400: zErrorDto,
        401: zErrorDto,
      },
    },
    logoutUser: {
      method: 'POST',
      path: '/logout',
      body: null,
      responses: {
        200: z.string(),
        400: zErrorDto,
        401: zErrorDto,
      },
    },
  },
  routerOptions,
)
