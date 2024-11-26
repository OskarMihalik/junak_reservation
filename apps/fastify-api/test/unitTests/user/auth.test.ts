import bcrypt from 'bcryptjs';
import { it, expect, describe } from 'vitest'

const mockUser = {
  email: 'test@example.com',
  password: await bcrypt.hash('securePassword123', 10),
};


export const authenticationTests = () => {
  describe('User Authentication', () => {
    it('should authenticate a valid user', async () => {
      const password = 'securePassword123';
      const match = await bcrypt.compare(password, mockUser.password);

      expect(match).toBe(true);
    });

    it('should reject authentication for an invalid user', async () => {
      const password = 'wrongPassword';
      const match = await bcrypt.compare(password, mockUser.password);

      expect(match).toBe(false);
    });
  });
}

if (import.meta.url === 'file://' + __filename) {
  // If so, run the tests immediately
  authenticationTests();
}
