import { initServer } from '@ts-rest/fastify'
import { initORM } from '../db.js'
import type { FastifyInstance } from 'fastify'
import { apiAdminScheduleContract } from "@workspace/contracts/src/features/adminSchedule.contract.js";
import { zRequestScheduleDto } from '@workspace/data'
import { DaySchedule } from '../../modules/daySchedule/daySchedule.entity.js'
import { ScheduleService } from "../services/adminScheduleService.js";
import { mapScheduleToResponseDto } from "../../modules/schedule/schedule.mapper.js";

const s = initServer()
const { em, userCtx, scheduleCtx } = await initORM()
const scheduleService = new ScheduleService(em, scheduleCtx);

export const adminScheduleContractRouter = (app: FastifyInstance) => ({
  routes: s.router(apiAdminScheduleContract, {
    getSchedulesAsync: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        const userId = request.request.user.id;
        const user = await userCtx.findOne({ id : userId });

        if(!user || !(user.isAdmin))
          return {
            status: 401,
            body: { message: 'Unauthorized' },
          };

        const schedules = await scheduleService.getSchedulesAsync();

        return {
          status: 200,
          body: schedules.map(schedule => mapScheduleToResponseDto(schedule)),
        };
      },
    },
    getScheduleByIdAsync: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        const userId = request.request.user.id;
        const user = await userCtx.findOne({ id : userId});

        if(!user || !(user.isAdmin))
          return {
            status: 401,
            body: { message: 'Unauthorized' },
          };

        const { id } = request.params;
        const schedule = await scheduleService.getScheduleByIdAsync(parseInt(id));

        if (!schedule) {
          return {
            status: 404,
            body: { message: 'Schedule not found' },
          };
        }

        return {
          status: 200,
          body: mapScheduleToResponseDto(schedule),
        };
      },
    },
    createScheduleAsync: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        const userId = request.request.user.id;
        const user = await userCtx.findOne({ id : userId});

        if(!user || !(user.isAdmin))
          return {
            status: 401,
            body: { message: 'Unauthorized' },
          };

        const scheduleData = zRequestScheduleDto.parse(request.body);
        const schedule = await scheduleService.createScheduleAsync(scheduleData);

        console.log(schedule);
        console.log("weee");
        return {
          status: 201,
          body: mapScheduleToResponseDto(schedule),
        };
      },
    },
    updateScheduleAsync: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        const userId = request.request.user.id;
        const user = await userCtx.findOne({ id : userId});

        if(!user || !(user.isAdmin))
          return {
            status: 401,
            body: { message: 'Unauthorized' },
          };

        const { id } = request.params;

        const scheduleToUpdate = await scheduleService.getScheduleByIdAsync(parseInt(id));
        if (!scheduleToUpdate) {
          return {
            status: 404,
            body: { message: 'Schedule not found' },
          };
        }

        if (scheduleToUpdate.daySchedules.getItems().some((daySchedule: DaySchedule) => daySchedule.currentCapacity > 0)) {
          return {
            status: 400,
            body: { message: 'Operation unavailable: Some day schedules have current capacity greater than 0' },
          };
        }

        const scheduleData = zRequestScheduleDto.parse(request.body);
        const schedule = await scheduleService.updateScheduleAsync(scheduleToUpdate, scheduleData);

        return {
          status: 200,
          body: mapScheduleToResponseDto(schedule),
        };
      },
    },
    deleteScheduleByIdAsync: {
      hooks: {
        preHandler: [app.authenticate],
      },
      handler: async (request) => {
        const userId = request.request.user.id;
        const user = await userCtx.findOne({ id : userId});

        if(!user || !(user.isAdmin))
          return {
            status: 401,
            body: { message: 'Unauthorized' },
          };

        const { id } = request.params;

        const schedule = await scheduleService.getScheduleByIdAsync(parseInt(id));
        if (!schedule) {
          return {
            status: 404,
            body: { message: 'Schedule not found' },
          };
        }

        if (schedule.daySchedules.getItems().some((daySchedule: DaySchedule) => daySchedule.currentCapacity > 0)) {
          return {
            status: 400,
            body: { message: 'Operation unavailable: Some day schedules have current capacity greater than 0' },
          };
        }

        await scheduleService.deleteScheduleByIdAsync(parseInt(id));

        return {
          status: 204,
          body: null,
        };
      },
    },
  }),
})
