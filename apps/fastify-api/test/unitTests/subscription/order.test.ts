import { describe, expect, it, vi, beforeEach } from 'vitest';
import { zRequestSubscriptionDto } from '@workspace/data';

const mockUserCtx = {
  findOne: vi.fn(),
}
const mockSubscriptionService = {
  orderSubscriptionAsync: vi.fn(),
}

const simulateOrderSubscriptionLogic = async (
  userId: number,
  subscriptionData: { subscriptionPeriod: number }
) => {
  const user = await mockUserCtx.findOne({ id: userId })

  if (!user) {
    return {
      status: 404,
      body: { message: 'User not found' },
    }
  }

  // Validate subscription data with Zod
  const validatedData = zRequestSubscriptionDto.parse(subscriptionData)

  await mockSubscriptionService.orderSubscriptionAsync(
    user.id,
    user.aisId,
    validatedData.subscriptionPeriod
  )

  return {
    status: 200,
    body: 'Subscription ordered',
  }
}


export const orderingTests = () => {
  describe('Order Subscription Logic', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    })

    it('should order a subscription successfully for a valid user', async () => {
      // Mock user found
      mockUserCtx.findOne.mockResolvedValueOnce({ id: 1, aisId: 12345 })

      // Mock subscription ordering
      mockSubscriptionService.orderSubscriptionAsync.mockResolvedValueOnce(undefined)

      const subscriptionData = { subscriptionPeriod: 12 }

      const result = await simulateOrderSubscriptionLogic(1, subscriptionData)

      expect(result).toEqual({
        status: 200,
        body: 'Subscription ordered',
      })

      expect(mockUserCtx.findOne).toHaveBeenCalledWith({ id: 1 })
      expect(mockSubscriptionService.orderSubscriptionAsync).toHaveBeenCalledWith(1, 12345, 12)
    })

    it('should throw a validation error if subscription data is invalid', async () => {
      // Mock user found
      mockUserCtx.findOne.mockResolvedValueOnce({ id: 1, aisId: 12345 })

      const invalidSubscriptionData = { subscriptionPeriod: 'not-a-number' } // Invalid data

      await expect(
        simulateOrderSubscriptionLogic(1, invalidSubscriptionData as any)
      ).rejects.toThrow() // Expect a Zod validation error

      expect(mockUserCtx.findOne).toHaveBeenCalledWith({ id: 1 })
      expect(mockSubscriptionService.orderSubscriptionAsync).not.toHaveBeenCalled()
    })
  })
}

if (import.meta.url === 'file://' + __filename) {
  orderingTests()
}
