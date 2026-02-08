import request from 'supertest';
import { app } from '../../../app';
import { User } from '../../../models/User';
import mongoose from 'mongoose';

const SKIP_DB_TESTS = process.env.NODE_ENV === 'test' && !process.env.RUN_INTEGRATION_TESTS;

// Variables prefixed with 'mock' are available in jest.mock
const mockUsers: any[] = [];

(SKIP_DB_TESTS ? describe.skip : describe)('Refresh Token Rotation', () => {
  let authCookie: string;

  beforeAll(async () => {
    jest.clearAllMocks();
    // @ts-ignore
    await User.deleteMany({});
  });

  it('should set httpOnly cookie on login', async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'Cookie Monster',
      email: 'cookie@test.com',
      password: 'AIGestion123!',
    });

    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'cookie@test.com',
      password: 'AIGestion123!',
    });

    expect(response.status).toBe(200);
    const cookies = response.headers['set-cookie'];
    authCookie = cookies.find((c: string) => c.startsWith('refresh_token'));
  });

  it('should rotate token on refresh', async () => {
    await new Promise(r => setTimeout(r, 10));

    const response = await request(app).get('/api/v1/auth/refresh').set('Cookie', [authCookie]);

    expect(response.status).toBe(200);
    const newCookies = response.headers['set-cookie'];
    const newAuthCookie = newCookies.find((c: string) => c.startsWith('refresh_token'));

    expect(newAuthCookie).not.toEqual(authCookie);
    authCookie = newAuthCookie;
  });

  it('should detect reuse and invalidate family', async () => {
    // 1. Get current valid cookie (Family A, generation 2)
    const checkResponse = await request(app)
      .get('/api/v1/auth/refresh')
      .set('Cookie', [authCookie]);
    expect(checkResponse.status).toBe(200);
    const validCookie = checkResponse.headers['set-cookie'][0];

    // 2. Legit refresh (switches to generation 3)
    const legitResponse = await request(app)
      .get('/api/v1/auth/refresh')
      .set('Cookie', [validCookie]);
    expect(legitResponse.status).toBe(200);

    // 3. ATTACK: Re-use generation 2 cookie
    const attackResponse = await request(app)
      .get('/api/v1/auth/refresh')
      .set('Cookie', [validCookie]);

    // Should fail
    expect(attackResponse.status).not.toBe(200);

    // 4. Legit user tries to use generation 3 cookie (should now be invalid due to family wipe)
    const nextGenCookie = legitResponse.headers['set-cookie'][0];
    const victimResponse = await request(app)
      .get('/api/v1/auth/refresh')
      .set('Cookie', [nextGenCookie]);

    // Should fail
    expect(victimResponse.status).not.toBe(200);
  });

  it('should logout correctly', async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'Cookie Monster 2',
      email: 'cookie2@test.com',
      password: 'AIGestion123!',
    });

    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'cookie2@test.com',
      password: 'AIGestion123!',
    });
    const cookie = loginResponse.headers['set-cookie'][0];

    const logoutResponse = await request(app).post('/api/v1/auth/logout').set('Cookie', [cookie]);

    expect(logoutResponse.status).toBe(200);
    const setCookie = logoutResponse.headers['set-cookie'][0];
    expect(setCookie).toMatch(/Max-Age=0|Expires=Thu, 01 Jan 1970/);
  });
});
