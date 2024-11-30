import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockAdminScheduleService = {
  getScheduleByIdAsync: vi.fn(),
  deleteScheduleByIdAsync: vi.fn(),
}
const mockUserCtx = {
  findOne: vi.fn(),
}

const simulateScheduleDeletion = async (userId: number, scheduleId: number) => {
  const user = await mockUserCtx.findOne({ id: userId })
  if (!user || !user.isAdmin) {
    return { status: 401, body: { message: 'Unauthorized' } }
  }

  const schedule = await mockAdminScheduleService.getScheduleByIdAsync(scheduleId);
  if (!schedule) {
    return { status: 404, body: { message: 'Schedule not found' } }
  }

  const hasActiveDaySchedules = schedule.daySchedules.getItems().some(
    (daySchedule: { currentCapacity: number }) => daySchedule.currentCapacity > 0
  )

  if (hasActiveDaySchedules) {
    return {
      status: 400,
      body: { message: 'Operation unavailable: Some day schedules have current capacity greater than 0' },
    }
  }

  await mockAdminScheduleService.deleteScheduleByIdAsync(scheduleId)
  return { status: 204, body: null }
}


export const deletionTests = () => {
  describe('Schedule Deletion Logic', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    })

    it('should return 400 if any day schedule has current capacity > 0', async () => {
      // Mock user and schedule data
      mockUserCtx.findOne.mockResolvedValueOnce({ id: 1, isAdmin: true });
      mockAdminScheduleService.getScheduleByIdAsync.mockResolvedValueOnce({
        id: 123,
        daySchedules: {
          getItems: vi.fn(() => [{ currentCapacity: 5 }]), // Mock day schedule with currentCapacity > 0
        },
      })

      const result = await simulateScheduleDeletion(1, 123)

      expect(result).toEqual({
        status: 400,
        body: { message: 'Operation unavailable: Some day schedules have current capacity greater than 0' },
      })

      expect(mockAdminScheduleService.getScheduleByIdAsync).toHaveBeenCalledWith(123)
      expect(mockAdminScheduleService.deleteScheduleByIdAsync).not.toHaveBeenCalled()
    })

    it('should return 401 for a non-admin user', async () => {
      // Mock user data for a non-admin user
      mockUserCtx.findOne.mockResolvedValueOnce({ id: 1, isAdmin: false })

      const result = await simulateScheduleDeletion(1, 123)

      expect(result).toEqual({
        status: 401,
        body: { message: 'Unauthorized' },
      })

      expect(mockUserCtx.findOne).toHaveBeenCalledWith({ id: 1 })
      expect(mockAdminScheduleService.getScheduleByIdAsync).not.toHaveBeenCalled()
      expect(mockAdminScheduleService.deleteScheduleByIdAsync).not.toHaveBeenCalled()
    })

    it('should delete schedule successfully if user is admin and no active day schedules exist', async () => {
      // Mock user and schedule data
      mockUserCtx.findOne.mockResolvedValueOnce({ id: 1, isAdmin: true })
      mockAdminScheduleService.getScheduleByIdAsync.mockResolvedValueOnce({
        id: 123,
        daySchedules: {
          getItems: vi.fn(() => []), // Mock no active day schedules
        },
      })

      const result = await simulateScheduleDeletion(1, 123)

      expect(result).toEqual({ status: 204, body: null })

      expect(mockAdminScheduleService.getScheduleByIdAsync).toHaveBeenCalledWith(123)
      expect(mockAdminScheduleService.deleteScheduleByIdAsync).toHaveBeenCalledWith(123)
    })

    it('should return 404 if the schedule is not found', async () => {
      // Mock user data and a non-existing schedule
      mockUserCtx.findOne.mockResolvedValueOnce({ id: 1, isAdmin: true })
      mockAdminScheduleService.getScheduleByIdAsync.mockResolvedValueOnce(null)

      const result = await simulateScheduleDeletion(1, 999)

      expect(result).toEqual({
        status: 404,
        body: { message: 'Schedule not found' },
      })

      expect(mockAdminScheduleService.getScheduleByIdAsync).toHaveBeenCalledWith(999)
      expect(mockAdminScheduleService.deleteScheduleByIdAsync).not.toHaveBeenCalled()
    })
  })
}

if (import.meta.url === 'file://' + __filename) {
  deletionTests()
}
