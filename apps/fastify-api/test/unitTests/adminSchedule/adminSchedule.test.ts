import { deletionTests } from './deletionCapacityRestriction.test'
import { unauthorizedAccessTests } from './unauthorizedAccess.test'
import { describe } from 'vitest'

export const adminScheduleUnitTests = () => {
  describe('Run All Test Suites', () => {
    deletionTests()
    unauthorizedAccessTests()
  })
}

if (import.meta.url === 'file://' + __filename) {
  // If so, run the tests immediately
  adminScheduleUnitTests()
}
