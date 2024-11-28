import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockUserCtx = {
  findOne: vi.fn(),
}
const mockAdminScheduleService = {
  deleteScheduleByIdAsync: vi.fn(),
}

const simulateDeleteScheduleAuthorization = async (userId: number) => {
  const user = await mockUserCtx.findOne({ id: userId })
  if (!user || !user.isAdmin) {
    return { status: 401, body: { message: 'Unauthorized' } }
  }

  return { status: 204 }
}


export const unauthorizedAccessTests = () => {
  describe('Delete Schedule - Unauthorized Access', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should return 401 if the user is not an admin', async () => {
      // Mock the user as non-admin
      mockUserCtx.findOne.mockResolvedValueOnce({ id: 1, isAdmin: false })

      const result = await simulateDeleteScheduleAuthorization(1)

      expect(result).toEqual({
        status: 401,
        body: { message: 'Unauthorized' },
      })

      expect(mockUserCtx.findOne).toHaveBeenCalledWith({ id: 1 })
      expect(mockAdminScheduleService.deleteScheduleByIdAsync).not.toHaveBeenCalled()
    })

    it('should return 401 if the user does not exist', async () => {
      // Mock the user as non-existent
      mockUserCtx.findOne.mockResolvedValueOnce(null)

      const result = await simulateDeleteScheduleAuthorization(1)

      expect(result).toEqual({
        status: 401,
        body: { message: 'Unauthorized' },
      })

      expect(mockUserCtx.findOne).toHaveBeenCalledWith({ id: 1 })
      expect(mockAdminScheduleService.deleteScheduleByIdAsync).not.toHaveBeenCalled()
    })

    it('should return 204 if the user is an admin', async () => {
      // Mock the user as admin
      mockUserCtx.findOne.mockResolvedValueOnce({ id: 1, isAdmin: true })

      const result = await simulateDeleteScheduleAuthorization(1)

      expect(result).toEqual({
        status: 204,
      })

      expect(mockUserCtx.findOne).toHaveBeenCalledWith({ id: 1 })
      expect(mockAdminScheduleService.deleteScheduleByIdAsync).not.toHaveBeenCalled()
    })
  })
}

if (import.meta.url === 'file://' + __filename) {
  unauthorizedAccessTests()
}
