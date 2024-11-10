import { type JWT } from '@fastify/jwt'
import type { UserDto } from '@workspace/data'

// adding jwt property to req
// authenticate property to FastifyInstance
declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT
  }
  export interface FastifyInstance {
    authenticate: any
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: UserDto
  }
}
