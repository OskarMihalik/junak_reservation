import { access } from 'fs'
import { z } from 'zod'

/**
 * Schedule DTO
 */
export interface RequestScheduleDto extends z.infer<typeof zRequestScheduleDto> {}
export interface ResponseScheduleDto extends z.infer<typeof zResponseScheduleDto> {}

export const DayEnum = z.enum(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'])

export const zRequestScheduleDto = z.object({
    day: DayEnum,
    section: z.array(
      z.object({
        startAt: z.string().datetime(),
        interval: z.number().int().multipleOf(5),
        capacity: z.number().int(),
        endAt: z.string().datetime(),
      })
    ),
})

export const zResponseScheduleDto = z.object({
    id: z.number().int().positive(),
    day: DayEnum,
    section: z.array(
      z.object({
        id: z.number().int().positive(),
        startAt: z.string().datetime(),
        interval: z.number().int().multipleOf(5),
        capacity: z.number().int(),
        currentCapacity: z.number().int(),
        endAt: z.string().datetime(),
      })
    ),
})
