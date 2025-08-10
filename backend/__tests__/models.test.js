const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require('../model');
const User = require('../userModel');
const Purchase = require('../purchaseModel');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear all collections before each test
  await Product.deleteMany({});
  await User.deleteMany({});
  await Purchase.deleteMany({});
});

describe('Product Model Tests', () => {
  test('should create a product with valid data', async () => {
    const productData = {
      name: 'Test Product',
      price: 99.99,
      description: 'A test product',
      category: 'Electronics',
      image: 'test-image.jpg',
      stock: 10
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe(productData.name);
    expect(savedProduct.price).toBe(productData.price);
    expect(savedProduct.stock).toBe(productData.stock);
  });

  test('should require name field', async () => {
    const productData = {
      price: 99.99,
      description: 'A test product'
    };

    const product = new Product(productData);
    let err;
    
    try {
      await product.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });

  test('should require price field', async () => {
    const productData = {
      name: 'Test Product',
      description: 'A test product'
    };

    const product = new Product(productData);
    let err;
    
    try {
      await product.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.price).toBeDefined();
  });
});

describe('User Model Tests', () => {
  test('should create a user with valid data', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
  });

  test('should require username field', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const user = new User(userData);
    let err;
    
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.username).toBeDefined();
  });
});

describe('Purchase Model Tests', () => {
  test('should create a purchase with valid data', async () => {
    const purchaseData = {
      userId: new mongoose.Types.ObjectId(),
      products: [{
        productId: new mongoose.Types.ObjectId(),
        quantity: 2,
        price: 99.99
      }],
      totalAmount: 199.98,
      status: 'pending'
    };

    const purchase = new Purchase(purchaseData);
    const savedPurchase = await purchase.save();

    expect(savedPurchase._id).toBeDefined();
    expect(savedPurchase.totalAmount).toBe(purchaseData.totalAmount);
    expect(savedPurchase.status).toBe(purchaseData.status);
    expect(savedPurchase.products).toHaveLength(1);
  });
});
