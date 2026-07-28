const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Vehicle = require('../src/models/Vehicle');
const jwt = require('jsonwebtoken');

let mongoServer;
let userToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = 'vehiclesearchsecret';

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
    name: 'Search User',
    email: 'search@example.com',
    password: 'password123',
    role: 'user',
  });

  userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  // Seed test inventory
  await Vehicle.create([
    { make: 'Toyota', model: 'Camry', category: 'Sedan', year: 2023, price: 25000, quantity: 5 },
    { make: 'Toyota', model: 'RAV4', category: 'SUV', year: 2024, price: 32000, quantity: 3 },
    { make: 'Honda', model: 'Civic', category: 'Sedan', year: 2022, price: 22000, quantity: 4 },
    { make: 'Ford', model: 'F-150', category: 'Truck', year: 2024, price: 45000, quantity: 2 },
    { make: 'Tesla', model: 'Model 3', category: 'Sedan', year: 2023, price: 38000, quantity: 1 },
  ]);
});

describe('Step 4: Vehicle Search API (GET /api/vehicles/search)', () => {
  it('should reject unauthenticated search requests (401)', async () => {
    const res = await request(app).get('/api/vehicles/search');
    expect(res.statusCode).toBe(401);
  });

  it('should filter vehicles by make (case-insensitive)', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=toyota')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body.every((v) => v.make.toLowerCase() === 'toyota')).toBe(true);
  });

  it('should filter vehicles by model (case-insensitive)', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?model=Civic')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].model).toBe('Civic');
  });

  it('should filter vehicles by category', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?category=SUV')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].category).toBe('SUV');
  });

  it('should filter vehicles by price range (minPrice & maxPrice)', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?minPrice=20000&maxPrice=30000')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2); // Toyota Camry ($25k), Honda Civic ($22k)
    expect(res.body.every((v) => v.price >= 20000 && v.price <= 30000)).toBe(true);
  });

  it('should combine multiple search criteria (make + category + maxPrice)', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=Toyota&category=Sedan&maxPrice=30000')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].model).toBe('Camry');
  });

  it('should return empty array when no vehicles match criteria', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=Ferrari')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});
