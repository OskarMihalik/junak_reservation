import { initServer } from '@ts-rest/fastify'
import { apiContract } from '@workspace/contracts'
import { initORM } from '../db'
import { User } from '../../modules/user/user.entity'
import bcrypt from 'bcrypt'
import { zUserDto } from '@workspace/data'
import type { FastifyInstance } from 'fastify'
import { mapUserToDto } from "../../modules/user/user.mapper";

const SALT_ROUNDS = 10

const s = initServer()
const db = await initORM()

export const userContractRouter = (app: FastifyInstance) => ({
  routes: s.router(apiContract.user, {
    getUsers: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async () => {
        const users = await db.orm.em.find(User, {});
        const usersDto = users.map(mapUserToDto);

        return {
          status: 200,
          body: usersDto,
        };
      },
    },
    getUser: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        var { id }  = request.params;

        const user = await db.orm.em.findOne(User, { id: parseInt(id) });

        const userDto = mapUserToDto(user as User);

        return {
          status: 200,
          body: userDto,
        }
      },
    },
    registerUser: {
      handler: async (request) => {
        request.body.password = await bcrypt.hash(request.body.password, SALT_ROUNDS)
        console.log(request.body)
        var user = new User(false, request.body.aisId, request.body.name, request.body.surname, request.body.email, request.body.password)
        const userCmd = db.user.create(user)

        await db.user.insert(userCmd)

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
          body: 'Logged out',
        }
      },
    },
  }),
})
