import { userUnitTests } from './user/user.test'
import { scheduleUnitTests } from './schedule/schedule.test'
import { adminScheduleUnitTests } from './adminSchedule/adminSchedule.test'
import { subscriptionUnitTests } from './subscription/subscription.test'
import { adminSubscriptionUnitTests } from './adminSubscription/adminSubscription.test'
import { tokenTests } from './user/token.test'
import { describe } from 'vitest'


describe('Run All Test Suites', () => {
  userUnitTests()
  tokenTests()
  scheduleUnitTests()
  adminScheduleUnitTests()
  subscriptionUnitTests()
  adminSubscriptionUnitTests()
})

