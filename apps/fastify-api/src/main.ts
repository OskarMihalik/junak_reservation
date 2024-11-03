import Fastify, { type FastifyInstance } from 'fastify'
import { app } from './app/app.js'
import { MikroORM, RequestContext } from '@mikro-orm/core'

export const HOST = process.env.HOST ?? 'localhost'
export const PORT = process.env.PORT ? Number(process.env.PORT) : 3939

const fastify: FastifyInstance = Fastify({ logger: true, disableRequestLogging: false })

const start = async (): Promise<void> => {
  try {
    await fastify.ready()

    // debug helpers --
    // console.info(fastify.printPlugins())
    // console.info(fastify.printRoutes())

    await fastify.listen({ host: HOST, port: PORT })
  } catch (error: unknown) {
    fastify.log.error(error)
    process.exit(1)
  }
}

await fastify.register(app)

await start()
