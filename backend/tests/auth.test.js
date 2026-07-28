const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = 'supersecretjwtkey';

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Step 2: Authentication & Authorization API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user and return token + user info', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('john@example.com');
      expect(res.body.user.role).toBe('user');
      expect(res.body.user.password).toBeUndefined();

      // Verify user in DB has hashed password
      const savedUser = await User.findOne({ email: 'john@example.com' });
      expect(savedUser).not.toBeNull();
      expect(savedUser.password).not.toBe('password123');
    });

    it('should fail registration when email already exists', async () => {
      await User.create({
        name: 'Existing User',
        email: 'john@example.com',
        password: 'hashedpassword',
        role: 'user',
      });

      const res = await request(app).post('/api/auth/register').send({
        name: 'John Copy',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user',
      });
    });

    it('should authenticate user with valid credentials and return JWT token', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'jane@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('jane@example.com');
    });

    it('should fail authentication with incorrect password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'jane@example.com',
        password: 'wrongpassword',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    it('should fail authentication for non-existent email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nobody@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('Auth & Role Middleware (Protected Routes)', () => {
    it('should reject access to protected route without Bearer token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });

    it('should allow access to protected route with valid Bearer token', async () => {
      const registerRes = await request(app).post('/api/auth/register').send({
        name: 'Protected User',
        email: 'protected@example.com',
        password: 'password123',
      });

      const token = registerRes.body.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe('protected@example.com');
    });
  });
});
