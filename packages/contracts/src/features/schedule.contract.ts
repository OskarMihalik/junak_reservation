import { initContract, type RouterOptions } from '@ts-rest/core'
import { z } from 'zod'
import {
  zErrorDto,
  zResponseScheduleDto
} from '@workspace/data'
import { SCHEDULE_CONTRACT_PATH_PREFIX } from "../constants";

const c = initContract()

const routerOptions: RouterOptions<typeof SCHEDULE_CONTRACT_PATH_PREFIX> = {
  pathPrefix: SCHEDULE_CONTRACT_PATH_PREFIX,
  strictStatusCodes: true,
}

export const apiScheduleContract = c.router(
  {
    getAllSchedules: {
      method: 'GET',
      path: '/',
      responses: {
        200: zResponseScheduleDto.array(),
        400: zErrorDto,
        401: zErrorDto,
      },
      summary: 'Get all schedules',
    },
    getSchedule: {
      method: 'GET',
      path: '/:id',
      responses: {
        200: zResponseScheduleDto,
        400: zErrorDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Get a specific schedule',
    },
    assignSchedule: {
      method: 'POST',
      path: '/assign/:id',
      body: z.null(),
      responses: {
        200: zResponseScheduleDto,
        400: zErrorDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Assign schedule',
    },
    unassignSchedule: {
      method: 'POST',
      path: '/unassign/:id',
      body: z.null(),
      responses: {
        200: zResponseScheduleDto,
        400: zErrorDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Unassign schedule',
    },
  },
  routerOptions,
)
