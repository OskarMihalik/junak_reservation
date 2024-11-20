import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import sensiblePlugin from './plugins/sensible.js'
import rootRoute from './routes/root.js'
import contractRoutes from './routes/contract.js'
import cors from '@fastify/cors'
import { MikroORM, RequestContext } from '@mikro-orm/core'
import { initORM } from './db.js'
import fjwt, { type FastifyJWT } from '@fastify/jwt'
import fCookie from '@fastify/cookie'

export interface AppOptions {}

export async function app(fastify: FastifyInstance, opts: AppOptions): Promise<void> {
  await fastify.register(cors, {
    origin: ['*'],
    methods: ['GET', 'POST'],
    credentials: true,
  })

  const db = await initORM()

  // jwt
  fastify.register(fjwt, { secret: 'supersecretcode-CHANGE_THIS-USE_ENV_FILE' })

  // register request context hook
  fastify.addHook('onRequest', (_request, _reply, done) => {
    RequestContext.create(db.em, done)
  })

  fastify.addHook('preHandler', (req, _res, next) => {
    // here we are
    req.jwt = fastify.jwt
    return next()
  })

  fastify.register(fCookie, {
    secret: 'some-secret-key',
    hook: 'preHandler',
  })

  fastify.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.cookies.access_token

    if (!token) {
      return reply.status(401).send({ message: 'Authentication required' })
    }
    // here decoded will be a different type by default but we want it to be of user-payload type
    const decoded = req.jwt.verify<FastifyJWT['user']>(token)
    req.user = decoded
  })

  // register plugins
  await fastify.register(sensiblePlugin, opts)

  // register an example route that's not part of the ts-rest contract
  await fastify.register(rootRoute, opts)

  // register ts-rest contract routes
  await fastify.register(contractRoutes, opts)

  fastify.addHook('onClose', (_instance, done) => {
    process.removeListener('SIGTERM', handleSignal)
    process.removeListener('SIGINT', handleSignal)
    process.removeListener('SIGUSR2', handleSignal)
    process.removeListener('uncaughtException', handleError)
    process.removeListener('unhandledRejection', handleError)

    db.orm.close()

    done()
  })

  const cleanup = async (): Promise<void> => {
    // add any cleanup code here to cleanup and close as required...
    // e.g. `await Promise.allSettled([...])`

    await new Promise((resolve) => setTimeout(resolve, 10))
  }

  const exit = async (): Promise<void> => {
    try {
      await fastify.close()
      process.exit(0)
    } catch (error: unknown) {
      fastify.log.warn('Error shutting down server')
      fastify.log.error(error)
      process.exit(1)
    }
  }

  const handleSignal = async (signal: string): Promise<void> => {
    fastify.log.warn(`Received signal ${signal}: attempting graceful shutdown...`)

    await cleanup()
    await exit()
  }

  const handleError = async (): Promise<void> => {
    fastify.log.warn(`Uncaught exception or promise rejection... attempting graceful shutdown...`)

    await cleanup()
    await exit()
  }

  process.once('uncaughtException', handleError)
  process.once('unhandledRejection', handleError)

  process.once('SIGINT', handleSignal) // control+C
  process.once('SIGTERM', handleSignal) // exit from lambda/heroku/etc
  process.once('SIGUSR2', handleSignal) // nodemon-like utility
}
