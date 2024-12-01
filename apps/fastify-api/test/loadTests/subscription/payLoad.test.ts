import axios from 'axios'
import { describe, expect, it } from 'vitest'

const NUM_REQUESTS = 5000
const CONCURRENT_USERS = 500
let COOKIE: string
const registerRequest = async () => {
  try {
    const response = await axios.post('http://localhost:3939/api/v1/users/register', {
      name: 'Wade',
      surname: 'Willson',
      aisId: '111333',
      email: 'deadpool@mail.com',
      password: 'password123'
    })
    return response.status === 201
  } catch (error) {
    return false
  }
}
const loginRequest = async () => {
  try {
    const response = await axios.post('http://localhost:3939/api/v1/users/login', {
      email: 'deadpool@mail.com',
      password: 'password123',
    })
    COOKIE = response.headers['set-cookie']
    return response.status === 200
  } catch (error) {
    return false
  }
}
const paySubscription = async () => {
  try {
    const response = await axios.post('http://localhost:3939/api/v1/subscriptions/pay', {
      subscriptionPeriod: 3
    })
    return response.status === 200
  } catch (error) {
    return false
  }
}

describe('Load Test - Pay Subscription Endpoint', () => {
  it('should handle 5000 pay subscription requests successfully', async () => {
    const registerResponse = await registerRequest()
    const loginResponse = await loginRequest()

    const promises = Array.from({ length: CONCURRENT_USERS }).map(() => paySubscription())
    let successfulRequests = 0

    for (let i = 0; i < NUM_REQUESTS / CONCURRENT_USERS; i++) {
      const results = await Promise.all(promises)
      successfulRequests += results.filter(Boolean).length
    }

    console.log(`Successful requests: ${successfulRequests}/${NUM_REQUESTS}`)
    expect(successfulRequests).toBe(NUM_REQUESTS)
  }, 120000)
})
