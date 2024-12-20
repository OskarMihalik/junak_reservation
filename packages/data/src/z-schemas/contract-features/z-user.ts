import { z } from 'zod'

/**
 * User example DTO
 */
export interface UserDto extends z.infer<typeof zUserDto> {}

export const zUserDto = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  surname: z.string(),
  aisId: z.number().int(),
  email: z.string().email(),
  isAdmin: z.boolean(),
})

export const zRegisterUserDto = z.object({
  name: z.string(),
  surname: z.string(),
  aisId: z.coerce.number().positive().min(1),
  email: z.string().email(),
  password: z.string(),
})

export const zLoginUserDto = z.object({
  email: z.string().email(),
  password: z.string(),
})
