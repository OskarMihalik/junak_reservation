import supertest from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';

let request: supertest.SuperTest<supertest.Test>;
let cookie: string;
let access_token: string;


export const adminSubcriptionAPITests = () => {

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

  describe('Admin subscription API Integration Tests (live DB)', () => {

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

    it('should GET all subscriptions', async () => {
      const response = await request.get('/api/v1/admin/subscriptions')
        .set('Cookie', `access_token=${access_token}`);

      expect(response.status).toBe(200);
    });

    it('should GET specific subscription', async () => {
      const response = await request.get('/api/v1/admin/subscriptions/1')
        .set('Cookie', `access_token=${access_token}`);
      console.log(response)

      expect(response.status).toBe(200);
    });

    it('should APPROVE specific subscription', async () => {
      const response = await request.post('/api/v1/admin/subscriptions/approve/1')
        .set('Cookie', `access_token=${access_token}`);
      console.log(response)

      expect(response.status).toBe(200);
    });

    it('should REVOKE specific subscription', async () => {
      const response = await request.post('/api/v1/admin/subscriptions/revoke/1')
        .set('Cookie', `access_token=${access_token}`);
      console.log(response)

      expect(response.status).toBe(200);
    });

  });
}
