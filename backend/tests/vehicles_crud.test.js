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
let testUser;
let testAdmin;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = 'vehiclecrudsecretkey';

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

  // Create standard user & admin
  testUser = await User.create({
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
  });

  testAdmin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  });

  userToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET);
  adminToken = jwt.sign({ id: testAdmin._id }, process.env.JWT_SECRET);
});

describe('Step 3: Vehicle CRUD API (/api/vehicles)', () => {
  describe('GET /api/vehicles', () => {
    it('should reject unauthenticated requests (401)', async () => {
      const res = await request(app).get('/api/vehicles');
      expect(res.statusCode).toBe(401);
    });

    it('should return list of all vehicles for authenticated user', async () => {
      await Vehicle.create([
        { make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 4 },
        { make: 'Ford', model: 'F-150', category: 'Truck', price: 40000, quantity: 2 },
      ]);

      const res = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /api/vehicles/:id', () => {
    it('should return vehicle details for valid ID', async () => {
      const vehicle = await Vehicle.create({
        make: 'Tesla',
        model: 'Model 3',
        category: 'Sedan',
        price: 35000,
        quantity: 3,
      });

      const res = await request(app)
        .get(`/api/vehicles/${vehicle._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.make).toBe('Tesla');
    });

    it('should return 404 for non-existent vehicle ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/vehicles/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/vehicles (Create - Admin only)', () => {
    it('should deny non-admin user from creating vehicle (403)', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          make: 'BMW',
          model: 'X5',
          category: 'SUV',
          price: 65000,
          quantity: 1,
        });

      expect(res.statusCode).toBe(403);
    });

    it('should allow admin to create a new vehicle (201)', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'BMW',
          model: 'X5',
          category: 'SUV',
          year: 2024,
          price: 65000,
          quantity: 3,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.make).toBe('BMW');
      expect(res.body.quantity).toBe(3);
    });
  });

  describe('PUT /api/vehicles/:id (Update - Admin only)', () => {
    it('should deny non-admin user from updating vehicle (403)', async () => {
      const vehicle = await Vehicle.create({
        make: 'Audi',
        model: 'A4',
        category: 'Sedan',
        price: 40000,
        quantity: 2,
      });

      const res = await request(app)
        .put(`/api/vehicles/${vehicle._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 38000 });

      expect(res.statusCode).toBe(403);
    });

    it('should allow admin to update vehicle (200)', async () => {
      const vehicle = await Vehicle.create({
        make: 'Audi',
        model: 'A4',
        category: 'Sedan',
        price: 40000,
        quantity: 2,
      });

      const res = await request(app)
        .put(`/api/vehicles/${vehicle._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 38000, quantity: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.price).toBe(38000);
      expect(res.body.quantity).toBe(5);
    });
  });

  describe('DELETE /api/vehicles/:id (Delete - Admin only)', () => {
    it('should deny non-admin user from deleting vehicle (403)', async () => {
      const vehicle = await Vehicle.create({
        make: 'Nissan',
        model: 'Altima',
        category: 'Sedan',
        price: 24000,
        quantity: 1,
      });

      const res = await request(app)
        .delete(`/api/vehicles/${vehicle._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });

    it('should allow admin to delete vehicle (200)', async () => {
      const vehicle = await Vehicle.create({
        make: 'Nissan',
        model: 'Altima',
        category: 'Sedan',
        price: 24000,
        quantity: 1,
      });

      const res = await request(app)
        .delete(`/api/vehicles/${vehicle._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');

      const found = await Vehicle.findById(vehicle._id);
      expect(found).toBeNull();
    });
  });
});
