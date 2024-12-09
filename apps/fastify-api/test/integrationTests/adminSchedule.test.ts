
import supertest from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';

let request: supertest.SuperTest<supertest.Test>;
let cookie: string;
let access_token: string;

export const adminScheduleAPITests = () => {

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

  describe.sequential('Admin schedule API Integration Tests (live DB)', () => {

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


    it('should GET all schedules', async () => {
      const response = await request.get('/api/v1/admin/schedules')
        .set('Cookie', `access_token=${access_token}`);

      console.log(response)
      expect(response.status).toBe(200);
    });

    it('should POST schedule', async () => {
      const requestBody = {
        day: 'MON', // A valid value from DayEnum
        date: '2025-12-04', // A valid ISO 8601 date string
        section: [
          {
            startAt: '2025-12-04T09:00:00Z',
            interval: 15, // A multiple of 5
            capacity: 10, // Positive integer
            endAt: '2025-12-04T09:15:00Z',
          },
          {
            startAt: '2025-12-04T10:00:00Z',
            interval: 30, // A multiple of 5
            capacity: 20, // Positive integer
            endAt: '2025-12-04T10:30:00Z',
          },
        ],
      };
      const response = await request.post('/api/v1/admin/schedules')
        .set('Cookie', `access_token=${access_token}`)
        .send(requestBody);

      console.log(response)
      expect(response.status).toBe(201);
    });


    it('should GET specific schedule', async () => {
      const response = await request.get('/api/v1/admin/schedules/1')
        .set('Cookie', `access_token=${access_token}`);

      console.log(response)
      expect(response.status).toBe(200);
    });


    it('should POST schedules for week', async () => {
      const requestBody = [
        {
          day: 'MON', // A valid value from DayEnum
          date: '2025-12-05',
          section: [
            {
              startAt: '2025-12-05T09:00:00Z',
              interval: 15, // Multiple of 5
              capacity: 10, // Positive integer
              endAt: '2025-12-05T09:15:00Z',
            },
            {
              startAt: '2025-12-05T10:00:00Z',
              interval: 30, // Multiple of 5
              capacity: 20, // Positive integer
              endAt: '2025-12-05T10:30:00Z',
            },
          ],
        },
        {
          day: 'TUE', // Another valid day
          date: '2025-12-06',
          section: [
            {
              startAt: '2025-12-06T09:00:00Z',
              interval: 30, // Multiple of 5
              capacity: 15, // Positive integer
              endAt: '2025-12-06T09:30:00Z',
            },
          ],
        },
      ];
      const response = await request.post('/api/v1/admin/schedules/week')
        .set('Cookie', `access_token=${access_token}`)
        .send(requestBody);

      console.log(response)
      expect(response.status).toBe(201);
    });

    ///////////////////////////////// UPDATE
    it('should UPDATE schedule', async () => {
      const requestBody = {
        day: 'TUE', // A valid value from DayEnum
        date: '2025-12-08', // A valid ISO 8601 date string
        section: [
          {
            startAt: '2025-12-08T09:00:00Z',
            interval: 15, // A multiple of 5
            capacity: 10, // Positive integer
            endAt: '2025-12-08T09:15:00Z',
          },
          {
            startAt: '2025-12-08T10:00:00Z',
            interval: 30, // A multiple of 5
            capacity: 20, // Positive integer
            endAt: '2025-12-08T10:30:00Z',
          },
        ],
      };
      const response = await request.put('/api/v1/admin/schedules/1')
        .set('Cookie', `access_token=${access_token}`)
        .send(requestBody);

      console.log(response)
      expect(response.status).toBe(200);
    });

    it('should DELETE specific schedule', async () => {
      const response = await request.delete('/api/v1/admin/schedules/1')
        .set('Cookie', `access_token=${access_token}`);

      console.log(response)
      expect(response.status).toBe(204);
    });

  });
}
