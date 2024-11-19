import { initContract, type RouterOptions } from '@ts-rest/core'
import { z } from 'zod'
import {
  zErrorDto, zResponseIntervalDto,
  zResponseScheduleDto
} from "@workspace/data";
import { SCHEDULE_CONTRACT_PATH_PREFIX } from "../constants.js";

const c = initContract()

const routerOptions: RouterOptions<typeof SCHEDULE_CONTRACT_PATH_PREFIX> = {
  pathPrefix: SCHEDULE_CONTRACT_PATH_PREFIX,
  strictStatusCodes: true,
}

export const apiScheduleContract = c.router(
  {
    getIntervalByIdAsync: {
      method: 'GET',
      path: '/:id',
      responses: {
        200: zResponseIntervalDto,
        400: zErrorDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Get a specific schedule interval',
    },
    assignScheduleAsync: {
      method: 'POST',
      path: '/assign/:id',
      body: null,
      responses: {
        200: z.string(),
        400: zErrorDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Assign schedule',
    },
    unassignScheduleAsync: {
      method: 'POST',
      path: '/unassign/:id',
      body: null,
      responses: {
        200: z.string(),
        400: zErrorDto,
        401: zErrorDto,
        404: zErrorDto,
      },
      summary: 'Unassign schedule',
    },
  },
  routerOptions,
)
