import { access } from 'fs'
import { z } from 'zod'

/**
 * User example DTO
 */
export interface UserDto extends z.infer<typeof zUserDto> {}

export const zUserDto = z.object({
  fullName: z.string(),
  email: z.string().email(),
})

export const zRegisterUserDto = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export const zRegisterUserResponseDto = z.object({
  fullName: z.string(),
  email: z.string().email(),
})

export const zLoginUserDto = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const zTokenDto = z.object({
  accessToken: z.string(),
})
