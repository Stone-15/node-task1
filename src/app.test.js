const request = require('supertest');

// Set env before requiring app
process.env.NODE_ENV = 'development';
process.env.PORT = '3099'; // isolated test port

const app = require('./app');

describe('GET /', () => {
  it('should return 200 with environment info', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('environment');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('server');
    expect(res.body).toHaveProperty('ports');
  });

  it('should return DEVELOPMENT as environment', async () => {
    const res = await request(app).get('/');
    expect(res.body.environment).toBe('DEVELOPMENT');
  });
});

describe('GET /health', () => {
  it('should return OK status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body).toHaveProperty('environment');
    expect(res.body).toHaveProperty('uptime');
  });
});

describe('GET /config', () => {
  it('should return config in development (debug=true)', async () => {
    const res = await request(app).get('/config');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('environment');
    expect(res.body).toHaveProperty('config');
  });
});

describe('GET /unknown', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/this-does-not-exist');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
