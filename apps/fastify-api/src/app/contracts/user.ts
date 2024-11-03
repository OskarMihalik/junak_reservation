import { initServer } from '@ts-rest/fastify'
import { apiContract } from '@workspace/contracts'
import { initORM } from '../db'
import { User } from '../../modules/user/user.entity'

const s = initServer()
const db = await initORM()

export const userContractRouter = s.router(apiContract.user, {
  getUser: async () => {
    const [items, total] = await db.orm.em.findAndCount(User, {})

    return {
      status: 200,
      body: items,
    }
  },
})
