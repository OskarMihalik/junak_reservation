import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockAdminSubscriptionService = {
  revokeSubscriptionAsync: vi.fn(),
}

const mockUserCtx = {
  findOne: vi.fn(),
}

const mockSubscriptionCtx = {
  findOne: vi.fn(),
}

const simulateRevokeSubscriptionLogic = async (userId: number, subscriptionId: number) => {
  const user = await mockUserCtx.findOne({ id: userId })

  if (!user || !user.isAdmin)
    return {
      status: 401,
      body: { message: 'Unauthorized' },
    }

  const subscription = await mockSubscriptionCtx.findOne({ id: subscriptionId })

  if (!subscription)
    return {
      status: 404,
      body: { message: 'Subscription not found' },
    }

  await mockAdminSubscriptionService.revokeSubscriptionAsync(subscription.id, user.id)

  return {
    status: 200,
    body: 'Subscription revoked',
  }
}

export const revokementTests = () => {
  describe('Revoke Subscription Logic', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should return 401 if the user is not an admin', async () => {
      mockUserCtx.findOne.mockResolvedValueOnce({ id: 1, isAdmin: false }) // Non-admin user

      const result = await simulateRevokeSubscriptionLogic(1, 123)

      expect(result).toEqual({
        status: 401,
        body: { message: 'Unauthorized' },
      })

      expect(mockUserCtx.findOne).toHaveBeenCalledWith({ id: 1 })
      expect(mockSubscriptionCtx.findOne).not.toHaveBeenCalled()
      expect(mockAdminSubscriptionService.revokeSubscriptionAsync).not.toHaveBeenCalled()
    })

    it('should return 404 if the subscription does not exist', async () => {
      mockUserCtx.findOne.mockResolvedValueOnce({ id: 1, isAdmin: true }) // Admin user
      mockSubscriptionCtx.findOne.mockResolvedValueOnce(null) // Subscription not found

      const result = await simulateRevokeSubscriptionLogic(1, 123)

      expect(result).toEqual({
        status: 404,
        body: { message: 'Subscription not found' },
      })

      expect(mockUserCtx.findOne).toHaveBeenCalledWith({ id: 1 })
      expect(mockSubscriptionCtx.findOne).toHaveBeenCalledWith({ id: 123 })
      expect(mockAdminSubscriptionService.revokeSubscriptionAsync).not.toHaveBeenCalled()
    })

    it('should revoke the subscription if the user is an admin and the subscription exists', async () => {
      mockUserCtx.findOne.mockResolvedValueOnce({ id: 1, isAdmin: true }) // Admin user
      mockSubscriptionCtx.findOne.mockResolvedValueOnce({ id: 123 }) // Subscription exists
      mockAdminSubscriptionService.revokeSubscriptionAsync.mockResolvedValueOnce(undefined) // Revoke subscription

      const result = await simulateRevokeSubscriptionLogic(1, 123)

      expect(result).toEqual({
        status: 200,
        body: 'Subscription revoked',
      })

      expect(mockUserCtx.findOne).toHaveBeenCalledWith({ id: 1 })
      expect(mockSubscriptionCtx.findOne).toHaveBeenCalledWith({ id: 123 })
      expect(mockAdminSubscriptionService.revokeSubscriptionAsync).toHaveBeenCalledWith(123, 1)
    })
  })
}

if (import.meta.url === 'file://' + __filename) {
  revokementTests()
}
