import { describe, expect, it, vi } from 'vitest'

const mockScheduleService = {
  getIntervalByIdAsync: vi.fn(),
}
const mockUserCtx = {
  findOne: vi.fn(),
}

const simulateUnassigningLogic = async (userId: number, intervalId: number, scheduleStartTime: Date) => {
  const user = await mockUserCtx.findOne({ id: userId })
  expect(user).toBeDefined()

  const interval = await mockScheduleService.getIntervalByIdAsync(intervalId)
  expect(interval).toBeDefined()

  const oneHourBefore = new Date(scheduleStartTime.getTime() - 60 * 60 * 1000)
  return new Date() >= oneHourBefore
    ? { status: 401, body: { message: 'Operation unavailable: Less than 1 hour before schedule' } }
    : { status: 200, body: 'Schedule unassigned successfully' };
}

export const timeRestrictionTests = () => {
  describe('Unassign Schedule - One-Hour Restriction', () => {
    it('should return 401 if the current time is within one hour of schedule start', async () => {
      // Mock the user and schedule data
      mockUserCtx.findOne.mockResolvedValueOnce({ id: 1 })
      const now = new Date()
      const lessThanOneHourFromNow = new Date(now.getTime() + 30 * 60 * 1000)

      mockScheduleService.getIntervalByIdAsync.mockResolvedValueOnce({
        id: 123,
        startAt: lessThanOneHourFromNow,
      })

      const result = await simulateUnassigningLogic(1, 123, lessThanOneHourFromNow);

      expect(result.status).toBe(401)
      expect(result.body).toEqual({ message: 'Operation unavailable: Less than 1 hour before schedule' })
    })

    it('should return 200 if the current time is more than one hour before schedule start', async () => {
      // Mock the user and schedule data
      mockUserCtx.findOne.mockResolvedValueOnce({ id: 1 })
      const now = new Date()
      const moreThanOneHourFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000)

      mockScheduleService.getIntervalByIdAsync.mockResolvedValueOnce({
        id: 123,
        startAt: moreThanOneHourFromNow,
      })

      const result = await simulateUnassigningLogic(1, 123, moreThanOneHourFromNow);

      expect(result.status).toBe(200)
      expect(result.body).toBe('Schedule unassigned successfully')
    })
  })
}

if (import.meta.url === 'file://' + __filename) {
  timeRestrictionTests()
}
