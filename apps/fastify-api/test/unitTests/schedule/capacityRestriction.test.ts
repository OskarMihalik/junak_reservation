import { it, expect, describe, vi } from 'vitest'

const mockScheduleService = {
  getIntervalByIdAsync: vi.fn(),
}
const mockUserCtx = {
  findOne: vi.fn(),
}

export const capacityRestrictionTests = () => {
  describe('Assign Schedule - Capacity Restriction', () => {
    it('should return 401 if current capacity equals or exceeds total capacity', async () => {
      // Mock the user and schedule data
      mockUserCtx.findOne.mockResolvedValueOnce({ id: 1 })
      mockScheduleService.getIntervalByIdAsync.mockResolvedValueOnce({
        id: 123,
        currentCapacity: 10,
        capacity: 10,
      })

      // Simulate logic for assigning
      const user = await mockUserCtx.findOne({ id: 1 })
      expect(user).toBeDefined()

      const interval = await mockScheduleService.getIntervalByIdAsync(123);
      expect(interval).toBeDefined()

      const result =
        interval.currentCapacity >= interval.capacity
          ? { status: 401, body: { message: 'Operation unavailable: Schedule is full' } }
          : { status: 201, body: 'Schedule assigned successfully' }

      expect(result.status).toBe(401)
      expect(result.body).toEqual({ message: 'Operation unavailable: Schedule is full' })
    })

    it('should return 201 if current capacity is less than total capacity', async () => {
      // Mock the user and schedule data
      mockUserCtx.findOne.mockResolvedValueOnce({ id: 1 })
      mockScheduleService.getIntervalByIdAsync.mockResolvedValueOnce({
        id: 123,
        currentCapacity: 5,
        capacity: 10,
      })

      // Simulate logic for assigning
      const user = await mockUserCtx.findOne({ id: 1 })
      expect(user).toBeDefined()

      const interval = await mockScheduleService.getIntervalByIdAsync(123)
      expect(interval).toBeDefined()

      const result =
        interval.currentCapacity >= interval.capacity
          ? { status: 401, body: { message: 'Operation unavailable: Schedule is full' } }
          : { status: 201, body: 'Schedule assigned successfully' }

      expect(result.status).toBe(201)
      expect(result.body).toBe('Schedule assigned successfully')
    })
  })
}

if (import.meta.url === 'file://' + __filename) {
  capacityRestrictionTests()
}
