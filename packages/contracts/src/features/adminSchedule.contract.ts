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
    getSchedulesAsync: {
      method: 'GET',
      path: '',
      responses: {
        200: zResponseScheduleDto.array(),
        401: zErrorDto,
      },
      summary: 'Get all schedules',
    },
    getScheduleByIdAsync: {
      method: 'GET',
      path: '/:id',
      responses: {
        200: zResponseScheduleDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Get a specific schedule',
    },
    createScheduleAsync: {
      method: 'POST',
      path: '',
      body: zRequestScheduleDto,
      responses: {
        201: zResponseScheduleDto,
        400: zErrorDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Create a new schedule',
    },
    updateScheduleAsync: {
      method: 'PUT',
      path: '/:id',
      body: zRequestScheduleDto,
      responses: {
        200: zResponseScheduleDto,
        400: zErrorDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Update a specific schedule',
    },
    deleteScheduleByIdAsync: {
      method: 'DELETE',
      path: '/:id',
      responses: {
        204: null,
        400: zErrorDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Delete a specific schedule',
    },
  },
  routerOptions,
)
