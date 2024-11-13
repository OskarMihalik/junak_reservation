import { EntityManager, EntityRepository, MikroORM, type Options } from '@mikro-orm/sqlite'
import type { User } from '../modules/user/user.entity'
import { User as UserClass } from '../modules/user/user.entity'
import type { Subscription } from "../modules/subscription/subscription.entity";
import { Subscription as SubscriptionClass } from "../modules/subscription/subscription.entity";
import type { Schedule } from "../modules/schedule/schedule.entity";
import { Schedule as ScheduleClass } from "../modules/schedule/schedule.entity";
import type { DaySchedule } from "../modules/daySchedule/daySchedule.entity";
import { DaySchedule as DayScheduleClass} from "../modules/daySchedule/daySchedule.entity";

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  user: EntityRepository<User>;
  subscription: EntityRepository<Subscription>;
  schedule: EntityRepository<Schedule>;
  daySchedule: EntityRepository<DaySchedule>;
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
    subscription: orm.em.getRepository(SubscriptionClass),
    schedule: orm.em.getRepository(ScheduleClass),
    daySchedule: orm.em.getRepository(DayScheduleClass)
  })
}
