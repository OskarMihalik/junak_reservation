import { z } from 'zod'

/**
 * Schedule DTO
 */
export interface RequestScheduleDto extends z.infer<typeof zRequestScheduleDto> {}
export interface ResponseScheduleDto extends z.infer<typeof zResponseScheduleDto> {}

export const DayEnum = z.enum(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'])

export const zRequestScheduleDto = z.object({
  day: DayEnum,
  date: z.string().date(),
  section: z.array(
    z.object({
      startAt: z.string().datetime(),
      interval: z.number().int().multipleOf(5).positive(),
      capacity: z.number().int().positive(),
      endAt: z.string().datetime(),
    }),
  ),
})

export const zResponseScheduleDto = z.object({
  id: z.number().int().positive(),
  day: DayEnum,
  date: z.coerce.date(),
  section: z.array(
    z.object({
      id: z.number().int().positive(),
      startAt: z.string().datetime(),
      interval: z.number().int().multipleOf(5),
      capacity: z.number().int(),
      currentCapacity: z.number().int(),
      endAt: z.string().datetime(),
    }),
  ),
})
export const zResponseIntervalDto = z.object({
  id: z.number().int().positive(),
  startAt: z.string().datetime(),
  interval: z.number().int().multipleOf(5),
  capacity: z.number().int(),
  currentCapacity: z.number().int(),
  listOfAssignedUsers: z.array(z.number().int().positive()),
  endAt: z.string().datetime(),
})
