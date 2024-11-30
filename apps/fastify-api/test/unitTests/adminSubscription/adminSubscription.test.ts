import { approvementTests } from './approving.test'
import { revokementTests } from './revoking.test'
import { describe } from 'vitest'

export const adminSubscriptionUnitTests = () => {
  describe('Run All Test Suites', () => {
    approvementTests()
    revokementTests()
  })
}

if (import.meta.url === 'file://' + __filename) {
  // If so, run the tests immediately
  adminSubscriptionUnitTests()
}
