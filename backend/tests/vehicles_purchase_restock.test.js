const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Vehicle = require('../src/models/Vehicle');
const jwt = require('jsonwebtoken');

let mongoServer;
let userToken;
let adminToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = 'purchaserestocksecret';

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
  await Vehicle.deleteMany({});

  const user = await User.create({
    name: 'Buyer User',
    email: 'buyer@example.com',
    password: 'password123',
    role: 'user',
  });

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  });

  userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
});

describe('Step 5: Atomic Purchase & Restock API', () => {
  describe('POST /api/vehicles/:id/purchase', () => {
    it('should reject unauthenticated purchase requests (401)', async () => {
      const vehicle = await Vehicle.create({
        make: 'Honda',
        model: 'Accord',
        category: 'Sedan',
        price: 28000,
        quantity: 2,
      });

      const res = await request(app).post(`/api/vehicles/${vehicle._id}/purchase`);
      expect(res.statusCode).toBe(401);
    });

    it('should atomically purchase vehicle when quantity > 0 (decrements quantity by 1)', async () => {
      const vehicle = await Vehicle.create({
        make: 'Honda',
        model: 'Accord',
        category: 'Sedan',
        price: 28000,
        quantity: 2,
      });

      const res = await request(app)
        .post(`/api/vehicles/${vehicle._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.quantity).toBe(1);

      // Verify directly in DB
      const updatedVehicle = await Vehicle.findById(vehicle._id);
      expect(updatedVehicle.quantity).toBe(1);
    });

    it('should fail purchase with 400 Out of Stock when quantity is 0', async () => {
      const vehicle = await Vehicle.create({
        make: 'Mazda',
        model: 'CX-5',
        category: 'SUV',
        price: 30000,
        quantity: 0,
      });

      const res = await request(app)
        .post(`/api/vehicles/${vehicle._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/out of stock/i);

      // Verify quantity remains 0
      const updatedVehicle = await Vehicle.findById(vehicle._id);
      expect(updatedVehicle.quantity).toBe(0);
    });

    it('should return 404 for non-existent vehicle ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post(`/api/vehicles/${fakeId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/vehicles/:id/restock (Admin only)', () => {
    it('should deny non-admin user from restocking vehicle (403)', async () => {
      const vehicle = await Vehicle.create({
        make: 'Hyundai',
        model: 'Elantra',
        category: 'Sedan',
        price: 21000,
        quantity: 1,
      });

      const res = await request(app)
        .post(`/api/vehicles/${vehicle._id}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ amount: 5 });

      expect(res.statusCode).toBe(403);
    });

    it('should allow admin to atomically restock vehicle (increments quantity)', async () => {
      const vehicle = await Vehicle.create({
        make: 'Hyundai',
        model: 'Elantra',
        category: 'Sedan',
        price: 21000,
        quantity: 1,
      });

      const res = await request(app)
        .post(`/api/vehicles/${vehicle._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ amount: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.quantity).toBe(6);

      // Verify in DB
      const updatedVehicle = await Vehicle.findById(vehicle._id);
      expect(updatedVehicle.quantity).toBe(6);
    });

    it('should fail restock if amount is invalid or <= 0', async () => {
      const vehicle = await Vehicle.create({
        make: 'Hyundai',
        model: 'Elantra',
        category: 'Sedan',
        price: 21000,
        quantity: 1,
      });

      const res = await request(app)
        .post(`/api/vehicles/${vehicle._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ amount: -2 });

      expect(res.statusCode).toBe(400);
    });
  });
});
