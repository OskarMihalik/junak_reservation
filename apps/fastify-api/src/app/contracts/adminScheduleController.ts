import { initServer } from '@ts-rest/fastify'
import { initORM } from '../db.js'
import type { FastifyInstance } from 'fastify'
import { apiAdminScheduleContract } from "@workspace/contracts/src/features/adminSchedule.contract.js";
import { zRequestScheduleDto } from '@workspace/data'
import { DaySchedule } from '../../modules/daySchedule/daySchedule.entity.js'
import { AdminScheduleService } from "../services/adminScheduleService.js";
import { mapScheduleToResponseDto } from "../../modules/schedule/schedule.mapper.js";
import { z } from 'zod'

const s = initServer()
const { em, userCtx, scheduleCtx } = await initORM()
const adminScheduleService = new AdminScheduleService(em, scheduleCtx);

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

        const schedules = await adminScheduleService.getSchedulesAsync();

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
        const schedule = await adminScheduleService.getScheduleByIdAsync(parseInt(id));

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
        const schedule = await adminScheduleService.createScheduleAsync(scheduleData);

        return {
          status: 201,
          body: mapScheduleToResponseDto(schedule),
        };
      },
    },
    createWeekScheduleAsync: {
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

        const schedulesData = z.array(zRequestScheduleDto).parse(request.body);
        const createdSchedules = [];

        for (const scheduleData of schedulesData) {
          const schedule = await adminScheduleService.createScheduleAsync(scheduleData);
          createdSchedules.push(mapScheduleToResponseDto(schedule));
        }

        return {
          status: 201,
          body: createdSchedules,
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

        const scheduleToUpdate = await adminScheduleService.getScheduleByIdAsync(parseInt(id));
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
        const schedule = await adminScheduleService.updateScheduleAsync(scheduleToUpdate, scheduleData);

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

        const schedule = await adminScheduleService.getScheduleByIdAsync(parseInt(id));
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

        await adminScheduleService.deleteScheduleByIdAsync(parseInt(id));

        return {
          status: 204,
          body: null,
        };
      },
    },
  }),
})
