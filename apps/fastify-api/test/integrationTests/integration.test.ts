import {userAPITests} from './user.test'
import {subscriptionAPITests} from './subscription.test'
import {adminSubcriptionAPITests} from './adminSubscription.test'
import {adminScheduleAPITests} from './adminSchedule.test'
import {scheduleAPITests} from './schedule.test'
import { describe } from 'vitest'

describe('Run ALL integration test suites in sequence', () => {
  userAPITests();
  subscriptionAPITests();
  adminSubcriptionAPITests();
  adminScheduleAPITests();
  scheduleAPITests();
});

