import { z } from 'zod'

/**
 * Schedule DTO
 */

export const SubscriptionStatusEnum = z.enum(['WAITING', 'APPROVED', 'REVOKED', 'EXPIRED'])

export const zRequestSubscriptionDto = z.object({
  subscriptionPeriod: z.number().int().positive()
})

export const zResponseSubscriptionDto = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  variableSymbol: z.number().int().positive(),
  subscriptionPeriod: z.number().int().positive(),
  status: SubscriptionStatusEnum,
  generatedAt: z.string().datetime(),
  approvedAt: z.string().datetime().nullable(),
  approvedBy: z.number().int().positive().nullable(),
  expiresAt: z.string().datetime().nullable(),
  revokedAt: z.string().datetime().nullable(),
  revokedBy: z.number().int().positive().nullable(),
})
