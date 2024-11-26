import bcrypt from 'bcryptjs'
import { it, expect, describe } from 'vitest'

export const passwordTests = () => {
  describe('Password Hashing', () => {
    const SALT_ROUNDS = 10;

    it('should hash a password correctly', async () => {
      const password = 'securePassword123';
      const hash = await bcrypt.hash(password, SALT_ROUNDS);

      expect(hash).not.toBe(password); // Ensure hashed password is different
      expect(await bcrypt.compare(password, hash)).toBe(true); // Ensure comparison works
    });

    it('should fail to compare an incorrect password', async () => {
      const password = 'securePassword123';
      const incorrectPassword = 'wrongPassword';
      const hash = await bcrypt.hash(password, SALT_ROUNDS);

      expect(await bcrypt.compare(incorrectPassword, hash)).toBe(false);
    });
  });
}

if (import.meta.url === 'file://' + __filename) {
  // If so, run the tests immediately
  passwordTests();
}
