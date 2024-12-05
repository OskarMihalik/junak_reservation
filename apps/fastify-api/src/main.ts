import Fastify, { type FastifyInstance } from 'fastify'
import { app } from './app/app.js'
import { SubscriptionValidator } from './app/utils/subscriptionValidator.js'

export const HOST = 'localhost'
export const PORT = process.env.PORT ? Number(process.env.PORT) : 3939

export const fastifyInstance: FastifyInstance = Fastify({ logger: true, disableRequestLogging: false })

const start = async (): Promise<void> => {
  try {
    await fastifyInstance.ready()

    await SubscriptionValidator.checkAndExpireSubscriptionsAsync()

    await fastifyInstance.listen({ host: '0.0.0.0', port: PORT })
  } catch (error: unknown) {
    fastifyInstance.log.error(error)
    process.exit(1)
  }
}

await fastifyInstance.register(app)

await start()
