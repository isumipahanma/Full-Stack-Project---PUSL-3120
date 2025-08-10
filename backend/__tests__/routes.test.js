const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const cors = require('cors');

let mongoServer;
let app;

// Mock the models
jest.mock('../model', () => {
  return mongoose.model('Product', new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    category: String,
    stock: Number
  }));
});

jest.mock('../userModel', () => {
  return mongoose.model('User', new mongoose.Schema({
    username: String,
    email: String,
    password: String
  }));
});

jest.mock('../purchaseModel', () => {
  return mongoose.model('Purchase', new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    products: [{
      productId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      price: Number
    }],
    totalAmount: Number,
    status: String
  }));
});

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  
  // Create a test app with routes
  app = express();
  app.use(cors());
  app.use(express.json());
  
  // Import and use routes
  const router = require('../router');
  app.use('/api', router);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('API Routes Tests', () => {
  describe('Product Routes', () => {
    test('GET /api/products should return products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);
      
      expect(response.body).toBeDefined();
    });

    test('GET /api/products/:category should return products by category', async () => {
      const response = await request(app)
        .get('/api/products/Electronics')
        .expect(200);
      
      expect(response.body).toBeDefined();
    });

    test('POST /api/products should create a new product', async () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        description: 'A test product',
        category: 'Electronics',
        stock: 10
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(201);
      
      expect(response.body).toBeDefined();
      expect(response.body.name).toBe(productData.name);
    });
  });

  describe('User Routes', () => {
    test('POST /api/users/register should register a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);
      
      expect(response.body).toBeDefined();
      expect(response.body.username).toBe(userData.username);
    });

    test('POST /api/users/login should authenticate user', async () => {
      const loginData = {
        username: 'testuser',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(200);
      
      expect(response.body).toBeDefined();
    });
  });

  describe('Purchase Routes', () => {
    test('POST /api/purchases should create a new purchase', async () => {
      const purchaseData = {
        userId: new mongoose.Types.ObjectId().toString(),
        products: [{
          productId: new mongoose.Types.ObjectId().toString(),
          quantity: 2,
          price: 99.99
        }],
        totalAmount: 199.98
      };

      const response = await request(app)
        .post('/api/purchases')
        .send(purchaseData)
        .expect(201);
      
      expect(response.body).toBeDefined();
      expect(response.body.totalAmount).toBe(purchaseData.totalAmount);
    });

    test('GET /api/purchases/:userId should return user purchases', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .get(`/api/purchases/${userId}`)
        .expect(200);
      
      expect(response.body).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('GET /api/nonexistent should return 404', async () => {
      await request(app)
        .get('/api/nonexistent')
        .expect(404);
    });

    test('POST /api/products with invalid data should return 400', async () => {
      const invalidProduct = {
        name: '', // Invalid: empty name
        price: -10 // Invalid: negative price
      };

      await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect(400);
    });
  });
});
