// apps/fastify-api/src/service/schedule.service.ts
import { EntityManager } from '@mikro-orm/core'
import { EntityRepository } from '@mikro-orm/sqlite'
import { DaySchedule } from '../../modules/daySchedule/daySchedule.entity.js'
import { Schedule } from '../../modules/schedule/schedule.entity.js'
import { getWeekDays } from '@workspace/common'

export class ScheduleService {
  constructor(
    private em: EntityManager,
    private scheduleCtx: EntityRepository<Schedule>,
    private dayScheduleCtx: EntityRepository<DaySchedule>,
  ) {}

  async getIntervalByIdAsync(intervalId: number) {
    return await this.dayScheduleCtx.findOne({ id: intervalId })
  }
  async getWeekScheduleByDayAsync(day: Date) {
    const weekDays = this.getWeekDays(day).map(date => date.toISOString().split('T')[0])
    return await this.scheduleCtx.find(
      { date: { $in: weekDays } },
      {
        populate: ['daySchedules'],
        orderBy: {
          date: 'asc',
          daySchedules: {
            startAt: 'asc'
          }
        }
      }
    );
  }
  async assignScheduleAsync(intervalId: number, userId: number) {
    return await this.em.transactional(async em => {
      try {
        const interval = await this.dayScheduleCtx.findOne({ id: intervalId })
        if (!interval) {
          throw new Error('Interval not found')
        }

        interval.currentCapacity += 1
        interval.listOfAssignedUsers = [...interval.listOfAssignedUsers, userId]

        await em.persistAndFlush(interval)

        return interval
      } catch (error) {
        await em.rollback()
        throw error
      }
    })
  }
  async unassignScheduleAsync(intervalId: number, userId: number) {
    return await this.em.transactional(async em => {
      try {
        const interval = await this.dayScheduleCtx.findOne({ id: intervalId })
        if (!interval) {
          throw new Error('Interval not found')
        }

        interval.currentCapacity -= 1
        interval.listOfAssignedUsers = interval.listOfAssignedUsers.filter((id: number) => id !== userId)

        await em.persistAndFlush(interval)

        return interval
      } catch (error) {
        await em.rollback()
        throw error
      }
    })
  }
  getWeekDays(date: Date): Date[] {
    const result: Date[] = []
    const currentDay = date.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Predpokladáme, že týždeň začína v pondelok
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - (currentDay === 0 ? 6 : currentDay - 1))

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      result.push(day)
    }

    return result
  }
}
