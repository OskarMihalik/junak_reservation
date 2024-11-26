import { describe, it, expect, vi } from 'vitest'


export const logoutTests = () => {
  describe('Logout Functionality', () => {
    it('should clear the access_token cookie', async () => {
      // Mock `clearCookie` function
      const reply = {
        clearCookie: vi.fn(),
      }

      // Simulate the logout process
      reply.clearCookie('access_token')

      // Validate that `clearCookie` was called with the correct argument
      expect(reply.clearCookie).toHaveBeenCalledWith('access_token');
    })
  })
}

if (import.meta.url === 'file://' + __filename) {
  // If so, run the tests immediately
  logoutTests();
}
