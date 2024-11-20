import { EntityManager, EntityRepository, MikroORM, type Options } from '@mikro-orm/sqlite'
import type { User } from '../modules/user/user.entity.js'
import { User as UserClass } from '../modules/user/user.entity.js'
import type { Subscription } from '../modules/subscription/subscription.entity.js'
import { Subscription as SubscriptionClass } from '../modules/subscription/subscription.entity.js'
import type { Schedule } from '../modules/schedule/schedule.entity.js'
import { Schedule as ScheduleClass } from '../modules/schedule/schedule.entity.js'
import type { DaySchedule } from '../modules/daySchedule/daySchedule.entity.js'
import { DaySchedule as DayScheduleClass} from '../modules/daySchedule/daySchedule.entity.js'

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  userCtx: EntityRepository<User>;
  subscriptionCtx: EntityRepository<Subscription>;
  scheduleCtx: EntityRepository<Schedule>;
  dayScheduleCtx: EntityRepository<DaySchedule>;
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
    userCtx: orm.em.getRepository(UserClass),
    subscriptionCtx: orm.em.getRepository(SubscriptionClass),
    scheduleCtx: orm.em.getRepository(ScheduleClass),
    dayScheduleCtx: orm.em.getRepository(DayScheduleClass)
  })
}
