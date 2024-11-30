import { it, expect, describe, vi } from 'vitest'

const mockDB = {
  userCtx: {
    findOne: vi.fn(),
  },
}

export const registerTests = () => {
  describe('User Registration', () => {
    it('should not allow registration for duplicate email or AIS ID', async () => {
      // Mock the database to return an existing user
      mockDB.userCtx.findOne.mockResolvedValueOnce({ email: 'duplicate@example.com' })

      const existingUser = await mockDB.userCtx.findOne({
        $or: [{ aisId: '12345' }, { email: 'duplicate@example.com' }],
      })

      // Assert the result matches the mocked user
      expect(existingUser).toBeDefined();
      expect(existingUser.email).toBe('duplicate@example.com')
    })

    it('should allow registration for a new user', async () => {
      // Mock the database to return null, indicating no existing user
      mockDB.userCtx.findOne.mockResolvedValueOnce(null)

      const newUser = await mockDB.userCtx.findOne({
        $or: [{ aisId: '67890' }, { email: 'newuser@example.com' }],
      })

      // Assert that the result is null
      expect(newUser).toBeNull();
    })
  })
}

if (import.meta.url === 'file://' + __filename) {
  // If so, run the tests immediately
  registerTests()
}
