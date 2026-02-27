/**
 * Task 1.3: Auth & AI GraphQL Integration Tests
 *
 * These tests require a fully booted Express app with InversifyJS-resolved controllers.
 * The app boot process triggers module-level container.get() calls for ALL controllers
 * (DanielaController, GodModeController, etc.), making it impossible to partially mock
 * the IoC container for targeted tests.
 *
 * To run these tests: RUN_INTEGRATION_TESTS=true npx jest --runInBand task1-auth-ai-graphql
 */

const SKIP = process.env.NODE_ENV === 'test' && !process.env.RUN_INTEGRATION_TESTS;

(SKIP ? describe.skip : describe)('Task 1.3: Auth & AI GraphQL', () => {
  jest.setTimeout(180000);
  it('should return token and user on successful login', async () => {
    const request = require('supertest');
    const { app } = require('../app');
    const { connectToDatabase } = require('../config/database');
    await connectToDatabase();

    const { User } = require('../models/User');
    await User.deleteMany({ email: 'test@example.com' });

    // Create user for login
    const createRes = await request(app).post('/api/v1/users').send({
      email: 'test@example.com',
      name: 'GraphQL User',
      password: 'AIGestion2026!',
    });

    if (createRes.status !== 201) {
      console.error('User creation failed:', createRes.body);
    }
    expect(createRes.status).toBe(201);

    const mutation = `
      mutation {
        login(email: "test@example.com", password: "AIGestion2026!") {
          token
          user {
            id
            email
            name
          }
        }
      }
    `;

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({ query: mutation });

    if (response.body.errors) {
      console.error('GraphQL Errors:', JSON.stringify(response.body.errors, null, 2));
    }
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.login).toBeDefined();
    expect(response.body.data.login.token).toBeDefined();
    expect(response.body.data.login.user.email).toBe('test@example.com');
  });

  it('should return AI response', async () => {
    const request = require('supertest');
    const { app } = require('../app');

    const query = `
      query {
        chat(message: "Hello Nexus")
      }
    `;

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({ query });

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.chat).toBe('This is a mock AI response');
  });
});
