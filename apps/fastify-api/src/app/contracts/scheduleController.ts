import { initServer } from '@ts-rest/fastify'
import { initORM } from '../db.js'
import type { FastifyInstance } from 'fastify'
import { ScheduleService } from "../services/scheduleService.js";
import { apiScheduleContract } from "@workspace/contracts/src/features/schedule.contract.js";
import { mapDayScheduleToIntervalDto } from "../../modules/daySchedule/daySchedule.mapper.js";
import { mapScheduleToResponseDto } from '../../modules/schedule/schedule.mapper.js'

const s = initServer()
const { em, userCtx, scheduleCtx, dayScheduleCtx } = await initORM()
const scheduleService = new ScheduleService(em, scheduleCtx, dayScheduleCtx);

export const scheduleContractRouter = (app: FastifyInstance) => ({
  routes: s.router(apiScheduleContract, {
    getIntervalByIdAsync: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        const userId = request.request.user.id;
        const user = await userCtx.findOne({ id : userId});

        if(!user)
          return {
            status: 404,
            body: { message: 'User not found' },
          };
        const { id } = request.params;
        const interval = await scheduleService.getIntervalByIdAsync(parseInt(id));
        console.log(interval);
        if (!interval) {
          return {
            status: 404,
            body: { message: 'Schedule not found' },
          };
        }
        return {
          status: 201,
          body: mapDayScheduleToIntervalDto(interval),
        };
      },
    },
    getWeekScheduleByDayAsync: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        const userId = request.request.user.id;
        const user = await userCtx.findOne({ id : userId});

        if(!user)
          return {
            status: 404,
            body: { message: 'User not found' },
          };

        const day  = request.params.day;
        const schedules = await scheduleService.getWeekScheduleByDayAsync(day);

        return {
          status: 201,
          body: schedules.map(schedule => mapScheduleToResponseDto(schedule)),
        };
      },
    },
    assignScheduleAsync: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        const userId = request.request.user.id;
        const user = await userCtx.findOne({ id : userId});

        if(!user)
          return {
            status: 404,
            body: { message: 'User not found' },
          };

        //TODO check if subscribtion active

        const { id } = request.params;
        const interval = await scheduleService.getIntervalByIdAsync(parseInt(id));

        if (!interval) {
          return {
            status: 404,
            body: { message: 'Schedule not found' },
          };
        }
        if (interval.listOfAssignedUsers.includes(user.id)) {
          return {
            status: 401,
            body: { message: 'Operation unavailable: User already assigned' },
          }
        }
        if (interval.currentCapacity >= interval.capacity) {
          return {
            status: 401,
            body: { message: 'Operation unavailable: Schedule is full' },
          }
        }

        const result = await scheduleService.assignScheduleAsync(interval.id, user.id);

        return {
          status: 201,
          body: "Schedule assigned successfully",
        };
      },
    },
    unassignScheduleAsync: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        const userId = request.request.user.id;
        const user = await userCtx.findOne({ id : userId});

        if(!user)
          return {
            status: 404,
            body: { message: 'User not found' },
          };

        //TODO check if subscribtion active

        const { id } = request.params;
        const interval = await scheduleService.getIntervalByIdAsync(parseInt(id));

        if (!interval) {
          return {
            status: 404,
            body: { message: 'Schedule not found' },
          };
        }
        const oneHourBefore = new Date(interval.startAt.getTime() - 60 * 60 * 1000);
        if (new Date() >= oneHourBefore) {
          return {
            status: 401,
            body: { message: 'Operation unavailable: Less than 1 hour before schedule' },
          };
        }

        const result = await scheduleService.unassignScheduleAsync(interval.id, user.id);

        return {
          status: 200,
          body: "Schedule unassigned successfully",
        };
      },
    },
  }),
})
