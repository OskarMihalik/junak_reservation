import { z } from 'zod'
import { zUserDto } from '../../z-schemas/contract-features/z-user.js';

/**
 * Schedule DTO
 */

export const SubscriptionStatusEnum = z.enum(['WAITING', 'APPROVED', 'REVOKED', 'EXPIRED'])

export const zRequestSubscriptionDto = z.object({
  subscriptionPeriod: z.number().int().positive()
})

export const zResponseSubscriptionDto = z.object({
  id: z.number().int().positive(),
  user: zUserDto.nullable(),
  variableSymbol: z.number().int().positive(),
  subscriptionPeriod: z.number().int().positive(),
  status: SubscriptionStatusEnum,
  generatedAt: z.string().datetime(),
  approvedAt: z.string().datetime().nullable(),
  approvedBy: zUserDto.nullable(),
  expiresAt: z.string().datetime().nullable(),
  revokedAt: z.string().datetime().nullable(),
  revokedBy: zUserDto.nullable(),
})
