import type { FastifyInstance } from 'fastify'
import sensiblePlugin from './plugins/sensible'
import rootRoute from './routes/root'
import contractRoutes from './routes/contract'
import cors from '@fastify/cors'

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
  // register plugins
  await fastify.register(sensiblePlugin, opts)

  // register an example route that's not part of the ts-rest contract
  await fastify.register(rootRoute, opts)

  // register ts-rest contract routes
  await fastify.register(contractRoutes, opts)
}
