import { initServer } from '@ts-rest/fastify'
import { apiContract } from '@workspace/contracts'
import { initORM } from '../db'
import { User } from '../../modules/user/user.entity'
import bcrypt from 'bcrypt'
import { zUserDto } from '@workspace/data'
import { app } from '../app'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { FastifyJWT } from '@fastify/jwt'

const SALT_ROUNDS = 10

const s = initServer()
const db = await initORM()

export const userContractRouter = (app: FastifyInstance) => ({
  routes: s.router(apiContract.user, {
    getUser: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async () => {
        const [items, total] = await db.orm.em.findAndCount(User, {})

        return {
          status: 200,
          body: items,
        }
      },
    },
    registerUser: {
      handler: async (request) => {
        request.body.password = await bcrypt.hash(request.body.password, 10)
        console.log(request.body)
        const user = db.user.create(request.body)

        await db.user.insert(user)

        return {
          status: 201,
          body: user,
        }
      },
    },
    loginUser: {
      handler: async (request) => {
        const body = request.body

        const user = await db.user.findOne({ email: body.email })
        if (!user) {
          return {
            status: 401,
            body: {
              message: 'User not found',
            },
          }
        }
        console.log(user)
        const match = await bcrypt.compare(body.password, user.password)
        if (!match) {
          return {
            status: 401,
            body: {
              message: 'Invalid password',
            },
          }
        }

        const parsedUser = zUserDto.parse(user)

        const token = request.request.jwt.sign(parsedUser)
        request.reply.setCookie('access_token', token, {
          path: '/',
          httpOnly: true,
          secure: true,
        })

        return {
          status: 200,
          body: {
            accessToken: token,
          },
        }
      },
    },
    logoutUser: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        request.reply.clearCookie('access_token')

        return {
          status: 200,
          body: null,
        }
      },
    },
  }),
})
