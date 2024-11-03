import { EntityManager, EntityRepository, MikroORM, type Options } from '@mikro-orm/sqlite'
import type { User } from '../modules/user/user.entity'
import { User as UserClass } from '../modules/user/user.entity'

export interface Services {
  orm: MikroORM
  em: EntityManager
  user: EntityRepository<User>
}

let cache: Services

export async function initORM(options?: Options): Promise<Services> {
  if (cache) {
    return cache
  }

  const orm = await MikroORM.init(options)

  // save to cache before returning
  return (cache = {
    orm,
    em: orm.em,
    user: orm.em.getRepository(UserClass),
  })
}
