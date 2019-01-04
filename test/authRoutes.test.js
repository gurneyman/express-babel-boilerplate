import request from 'supertest';
import app from '../src/app.js';

describe('POST /register', () => {
  it('should error when no body provided properly', async () => {
    await request(app).post('/register').expect(400);
  });

  // TODO: Properly test with mock data
});
