import { z } from 'zod'

/**
 * User example DTO
 */
export interface UserDto extends z.infer<typeof zUserDto> {}

export const zUserDto = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string(),
  bio: z.string().optional(),
})
