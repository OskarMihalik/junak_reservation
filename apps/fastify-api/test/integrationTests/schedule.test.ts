
import supertest from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';

let request: supertest.SuperTest<supertest.Test>;
let cookie: string;
let access_token: string;

export const scheduleAPITests = () => {

  function extractAccessToken(setCookieHeader) {
    if (!setCookieHeader || setCookieHeader.length === 0) {
      return null;
    }
    // Use string manipulation to find the access_token
    const accessTokenCookie = setCookieHeader.find(cookie => cookie.startsWith('access_token='));
    if (accessTokenCookie) {
      return accessTokenCookie.split(';')[0].split('=')[1];
    }
    return null;
  }

  beforeAll(() => {
    // Inicializácia requestu pre živý server
    request = supertest('http://localhost:3939'); // Nahraďte URL adresou vášho API
  });

  describe.sequential('Schedule API Integration Tests (live DB)', () => {

    beforeAll(async () => {
      // Prihlásenie ako admin a získanie tokenu
      const response = await request.post('/api/v1/users/login').send({
        email: 'john.doe@example.com',
        password: 'password123',
      });

      console.log(response.headers)
      cookie = response.headers['set-cookie'];
      access_token = extractAccessToken(cookie);
      // console.log(access_token);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('john.doe@example.com');
    });

    it('should GET specific schedules', async () => {
      const response = await request.get('/api/v1/schedules/3')
        .set('Cookie', `access_token=${access_token}`);

      console.log(response)
      console.log(response.status)
      expect(response.status).toBe(200);
    });

    it('should GET specific day in week', async () => {
      // const day = '2'; // The date you want to query
      const response = await request.get('/api/v1/schedules/week/2024-12-04')
        .set('Cookie', `access_token=${access_token}`);

      console.log(response)
      console.log(response.status)

      expect(response.status).toBe(200);
    });

    it('should POST/PAY subscription', async () => {
      const requestBody = {
        subscriptionPeriod: 6, // example valid subscription period
      };

      const response = await request.post('/api/v1/subscriptions/pay')
        .set('Cookie', `access_token=${access_token}`)
        .send(requestBody);

      console.log(response)

      expect(response.status).toBe(200);
    });

    it('should APPROVE specific subscription', async () => {
      const response = await request.post('/api/v1/admin/subscriptions/approve/2')
        .set('Cookie', `access_token=${access_token}`);
      console.log(response)

      expect(response.status).toBe(200);
    });

    it('should POST/assign to specific schedule', async () => {
      const response = await request.post('/api/v1/schedules/assign/3')
        .set('Cookie', `access_token=${access_token}`);

      console.log(response)
      console.log(response.status)

      expect(response.status).toBe(200);
    });

    it('should POST/unassign to specific schedule', async () => {
      const response = await request.post('/api/v1/schedules/unassign/3')
        .set('Cookie', `access_token=${access_token}`);

      console.log(response)
      console.log(response.status)

      expect(response.status).toBe(200);
    });

  });
}
