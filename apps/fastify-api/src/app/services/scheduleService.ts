// apps/fastify-api/src/service/schedule.service.ts
import { EntityManager } from '@mikro-orm/core';
import { EntityRepository } from "@mikro-orm/sqlite";
import { DaySchedule } from "../../modules/daySchedule/daySchedule.entity.js";


export class ScheduleService {
  constructor(private em: EntityManager, private dayScheduleCtx: EntityRepository<DaySchedule>) {}

  async getIntervalByIdAsync(intervalId: number) {
    return await this.dayScheduleCtx.findOne({ id: intervalId });
  }
  async assignScheduleAsync(intervalId: number, userId: number) {
    return await this.em.transactional(async (em) => {
      try {
        const interval = await this.dayScheduleCtx.findOne({ id: intervalId });
        if (!interval) {
          throw new Error('Interval not found');
        }

        interval.currentCapacity += 1;
        interval.listOfAssignedUsers = [...interval.listOfAssignedUsers, userId];

        await em.persistAndFlush(interval);

        return interval
      } catch (error) {
        await em.rollback();
        throw error;
      }
    });
  }
  async unassignScheduleAsync(intervalId: number, userId: number) {
    return await this.em.transactional(async (em) => {
      try {
        const interval = await this.dayScheduleCtx.findOne({ id: intervalId });
        if (!interval) {
          throw new Error('Interval not found');
        }

        interval.currentCapacity -= 1;
        interval.listOfAssignedUsers = interval.listOfAssignedUsers.filter((id: number) => id !== userId);

        await em.persistAndFlush(interval);

        return interval
      } catch (error) {
        await em.rollback();
        throw error;
      }
    });
  }
}
