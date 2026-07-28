const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;
let User;
let Vehicle;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = 'testsecretkey';

  // Import app and models
  app = require('../src/app');
  User = require('../src/models/User');
  Vehicle = require('../src/models/Vehicle');

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Step 1: Project Scaffold & Schemas', () => {
  describe('Express Boilerplate & Health Check', () => {
    it('GET /api/health should return status 200 OK and status message', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
    });
  });

  describe('User Schema', () => {
    it('should fail validation when required User fields are missing', async () => {
      const user = new User({});
      let err;
      try {
        await user.validate();
      } catch (error) {
        err = error;
      }
      expect(err).toBeDefined();
      expect(err.errors.name).toBeDefined();
      expect(err.errors.email).toBeDefined();
      expect(err.errors.password).toBeDefined();
    });

    it('should set default role to "user"', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(user.role).toBe('user');
    });

    it('should accept valid role "admin"', async () => {
      const user = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      });
      expect(user.role).toBe('admin');
    });
  });

  describe('Vehicle Schema', () => {
    it('should fail validation when required Vehicle fields are missing', async () => {
      const vehicle = new Vehicle({});
      let err;
      try {
        await vehicle.validate();
      } catch (error) {
        err = error;
      }
      expect(err).toBeDefined();
      expect(err.errors.make).toBeDefined();
      expect(err.errors.model).toBeDefined();
      expect(err.errors.category).toBeDefined();
      expect(err.errors.price).toBeDefined();
      expect(err.errors.quantity).toBeDefined();
    });

    it('should create a valid Vehicle document', async () => {
      const vehicleData = {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        year: 2024,
        price: 25000,
        quantity: 5,
      };
      const vehicle = new Vehicle(vehicleData);
      const err = vehicle.validateSync();
      expect(err).toBeUndefined();
      expect(vehicle.make).toBe('Toyota');
      expect(vehicle.quantity).toBe(5);
    });
  });
});
