import { authenticationTests } from "./auth.test";
import { logoutTests } from "./logout.test";
import { passwordTests } from "./password.test";
import { registerTests } from './registration.test'
import { tokenTests } from "./token.test";
import { describe } from 'vitest';

export const userUnitTests = () => {
  describe('Run All Test Suites', () => {
    passwordTests()
    registerTests()
    authenticationTests()
    tokenTests()
    logoutTests()
  });
}

if (import.meta.url === 'file://' + __filename) {
  // If so, run the tests immediately
  userUnitTests();
}
