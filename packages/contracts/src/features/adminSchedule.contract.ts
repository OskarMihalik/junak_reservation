import { initContract, type RouterOptions } from '@ts-rest/core'
import { z } from 'zod'
import {
  zErrorDto,
  zRequestScheduleDto,
  zResponseScheduleDto
} from '@workspace/data'
import { ADMIN_SCHEDULE_CONTRACT_PATH_PREFIX } from '../constants.js'

const c = initContract()

const routerOptions: RouterOptions<typeof ADMIN_SCHEDULE_CONTRACT_PATH_PREFIX> = {
  pathPrefix: ADMIN_SCHEDULE_CONTRACT_PATH_PREFIX,
  strictStatusCodes: true,
}

export const apiAdminScheduleContract = c.router(
  {
    getAllSchedules: {
      method: 'GET',
      path: '/',
      responses: {
        200: zResponseScheduleDto.array(),
        401: zErrorDto,
      },
      summary: 'Get all schedules',
    },
    getSchedule: {
      method: 'GET',
      path: '/:id',
      responses: {
        200: zResponseScheduleDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Get a specific schedule',
    },
    createSchedule: {
      method: 'POST',
      path: '/',
      body: zRequestScheduleDto,
      responses: {
        201: zResponseScheduleDto,
        400: zErrorDto,
      },
      summary: 'Create a new schedule',
    },
    updateSchedule: {
      method: 'PUT',
      path: '/:id',
      body: zRequestScheduleDto,
      responses: {
        200: zResponseScheduleDto,
        400: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Update a specific schedule',
    },
    deleteSchedule: {
      method: 'DELETE',
      path: '/:id',
      responses: {
        204: z.string(),
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Delete a specific schedule',
    },
  },
  routerOptions,
)
