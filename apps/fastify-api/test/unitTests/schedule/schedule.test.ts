import { timeRestrictionTests } from './oneHourRestriction.test'
import { capacityRestrictionTests } from './capacityRestriction.test'
import { describe } from 'vitest'

export const scheduleUnitTests = () => {
  describe('Run All Test Suites', () => {
    timeRestrictionTests()
    capacityRestrictionTests()
  })
}

if (import.meta.url === 'file://' + __filename) {
  // If so, run the tests immediately
  scheduleUnitTests()
}
