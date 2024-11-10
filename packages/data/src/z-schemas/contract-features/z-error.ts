import { z } from 'zod'

export const zErrorDto = z.object({
  message: z.string(),
})
