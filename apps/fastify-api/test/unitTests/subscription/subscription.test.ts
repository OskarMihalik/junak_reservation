import { orderingTests } from './order.test'
import { describe } from 'vitest'

export const subscriptionUnitTests = () => {
  describe('Run All Test Suites', () => {
    orderingTests()
  })
}

if (import.meta.url === 'file://' + __filename) {
  // If so, run the tests immediately
  subscriptionUnitTests()
}
