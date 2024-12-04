import supertest from 'supertest';
import { describe, it, expect, beforeAll} from 'vitest';

let request: supertest.SuperTest<supertest.Test>;
let cookie: string;
let access_token: string;


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
  request = supertest('http://localhost:3939');
});


export const userAPITests = () =>{
describe.sequential('User API Integration Tests (live DB)', () => {
  it('should REGISTER a new user', async () => {
    const response = await request.post('/api/v1/users/register').send({
      name: 'John',
      surname: 'Doe',
      aisId: 12345,
      email: 'john.doe@example.com',
      password: 'password123',
    })


    expect(response.status).toBe(201);
    expect(response.body.email).toBe('john.doe@example.com');
  });


  it('should login an existing user', async () => {
    const response = await request.post('/api/v1/users/login').send({
      email: 'john.doe@example.com',
      password: 'password123',
    });

    console.log(response.headers)
    cookie= response.headers['set-cookie'];
    access_token = extractAccessToken(cookie);
    // console.log(access_token);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('john.doe@example.com');
  });


  it('should get all users', async () => {
    const response = await request.get('/api/v1/users')
      .set('Cookie', `access_token=${access_token}`);

    console.log(response)

    expect(response.status).toBe(200);
  });

  it('should logout an existing user', async () => {

    const response = await request.post('/api/v1/users/logout')
      .set('Cookie', `access_token=${access_token}`);

    console.log(response)

    expect(response.status).toBe(200);
  });
});

}
