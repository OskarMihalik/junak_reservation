// apps/fastify-api/src/service/schedule.service.ts
import { zRequestScheduleDto, zResponseScheduleDto } from '@workspace/data';
import { EntityManager } from '@mikro-orm/core';
import { z } from "zod";
import { DayEnum, Schedule } from "../../modules/schedule/schedule.entity.js";
import { DaySchedule } from "../../modules/daySchedule/daySchedule.entity.js";
import { EntityRepository } from "@mikro-orm/sqlite";

export class ScheduleService {
  constructor(private em: EntityManager, private scheduleCtx: EntityRepository<Schedule>) {}

  async getSchedulesAsync() {
    return await this.scheduleCtx.find({}, { populate: ['daySchedules'] });
  }

  async getScheduleByIdAsync(scheduleId: number) {
    return await this.scheduleCtx.findOne({ id: scheduleId }, { populate: ['daySchedules'] });
  }

  async createScheduleAsync(scheduleData: z.infer<typeof zRequestScheduleDto>) {
    return await this.em.transactional(async (em) => {
      try {
        const schedule = new Schedule(
          scheduleData.day as DayEnum,
          new Date(scheduleData.date)
        );

        const daySchedules = scheduleData.section.map(section => this.createIntervals(schedule, section)).flat();

        schedule.daySchedules.add(...daySchedules as [DaySchedule, ...DaySchedule[]]);

        await em.persistAndFlush(schedule);

        return schedule;
      } catch (error) {
        await em.rollback();
        throw error;
      }
    });
  }

  async updateScheduleAsync(schedule: Schedule, scheduleData: z.infer<typeof zRequestScheduleDto>) {
    return await this.em.transactional(async (em) => {
      try {
        schedule.daySchedules.removeAll();

        const daySchedules = scheduleData.section.map(section => this.createIntervals(schedule, section)).flat();

        schedule.daySchedules.add(...daySchedules as [DaySchedule, ...DaySchedule[]]);

        await em.persistAndFlush(schedule);

        return schedule;
      } catch (error) {
        await em.rollback();
        throw error;
      }
    });
  }

  createIntervals(schedule: Schedule, section: any): DaySchedule[] {
    const startAt = new Date(section.startAt);
    const endAt = new Date(section.endAt);
    const interval = section.interval;
    const capacity = section.capacity;
    const intervals = [];

    let currentStart = startAt;
    while (currentStart.getTime() + interval * 60000 <= endAt.getTime()) {
      const currentEnd = new Date(currentStart.getTime() + interval * 60000);
      if (currentEnd.getTime() > endAt.getTime()) {
        break;
      }
      intervals.push(new DaySchedule(
        schedule,
        currentStart,
        interval,
        capacity,
        JSON.stringify([]),
        currentEnd
      ));
      currentStart = currentEnd;
    }

    return intervals;
  }

  async deleteScheduleByIdAsync(scheduleId: number) {
    return await this.em.transactional(async (em) => {
      try {
        await em.nativeDelete(Schedule, { id: scheduleId });
      } catch (error) {
        await em.rollback();
        throw error;
      }
    });
  }
}
