import type { FastifyInstance } from 'fastify'
import sensiblePlugin from './plugins/sensible'
import rootRoute from './routes/root'
import contractRoutes from './routes/contract'
import cors from '@fastify/cors'
import { MikroORM, RequestContext } from '@mikro-orm/core'
import { initORM } from './db'

export interface AppOptions {}

export async function app(fastify: FastifyInstance, opts: AppOptions): Promise<void> {
  await fastify.register(cors, {
    origin: (origin, cb) => {
      if (!origin) {
        cb(new Error('Not allowed'), false)
        return
      }
      const hostname = new URL(origin).hostname
      if (hostname === 'localhost') {
        //  Request from localhost will pass
        cb(null, true)
        return
      }
      // Generate an error on other origins, disabling access
      cb(new Error('Not allowed'), false)
    },
  })

  const db = await initORM()

  // register request context hook
  fastify.addHook('onRequest', (_request, _reply, done) => {
    RequestContext.create(db.em, done)
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
