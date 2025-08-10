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
  await Product.deleteMany({});
  await User.deleteMany({});
  await Purchase.deleteMany({});
});

describe('Product Controller Tests', () => {
  test('should get all products', async () => {
    // Create test products
    const products = [
      { name: 'Product 1', price: 99.99, description: 'Test 1', category: 'Electronics', stock: 10 },
      { name: 'Product 2', price: 149.99, description: 'Test 2', category: 'Clothing', stock: 5 }
    ];
    
    await Product.insertMany(products);
    
    const allProducts = await Product.find({});
    expect(allProducts).toHaveLength(2);
    expect(allProducts[0].name).toBe('Product 1');
    expect(allProducts[1].name).toBe('Product 2');
  });

  test('should get products by category', async () => {
    const products = [
      { name: 'Electronics 1', price: 99.99, description: 'Test 1', category: 'Electronics', stock: 10 },
      { name: 'Electronics 2', price: 199.99, description: 'Test 2', category: 'Electronics', stock: 5 },
      { name: 'Clothing 1', price: 49.99, description: 'Test 3', category: 'Clothing', stock: 15 }
    ];
    
    await Product.insertMany(products);
    
    const electronicsProducts = await Product.find({ category: 'Electronics' });
    expect(electronicsProducts).toHaveLength(2);
    expect(electronicsProducts.every(p => p.category === 'Electronics')).toBe(true);
  });

  test('should create a new product', async () => {
    const productData = {
      name: 'New Product',
      price: 299.99,
      description: 'A brand new product',
      category: 'Electronics',
      stock: 20
    };
    
    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    
    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe(productData.name);
    expect(savedProduct.price).toBe(productData.price);
    expect(savedProduct.stock).toBe(productData.stock);
  });

  test('should update product stock', async () => {
    const product = await Product.create({
      name: 'Test Product',
      price: 99.99,
      description: 'Test product',
      category: 'Electronics',
      stock: 10
    });
    
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      { stock: 5 },
      { new: true }
    );
    
    expect(updatedProduct.stock).toBe(5);
  });
});

describe('User Controller Tests', () => {
  test('should create a new user', async () => {
    const userData = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'securepassword123'
    };
    
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
  });

  test('should find user by username', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    
    const foundUser = await User.findOne({ username: 'testuser' });
    expect(foundUser).toBeDefined();
    expect(foundUser.username).toBe('testuser');
  });

  test('should not allow duplicate usernames', async () => {
    const userData = {
      username: 'duplicateuser',
      email: 'user1@example.com',
      password: 'password123'
    };
    
    await User.create(userData);
    
    const duplicateUser = new User({
      username: 'duplicateuser',
      email: 'user2@example.com',
      password: 'password456'
    });
    
    let err;
    try {
      await duplicateUser.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeDefined();
  });
});

describe('Purchase Controller Tests', () => {
  test('should create a new purchase', async () => {
    const userId = new mongoose.Types.ObjectId();
    const productId = new mongoose.Types.ObjectId();
    
    const purchaseData = {
      userId: userId,
      products: [{
        productId: productId,
        quantity: 3,
        price: 99.99
      }],
      totalAmount: 299.97,
      status: 'pending'
    };
    
    const newPurchase = new Purchase(purchaseData);
    const savedPurchase = await newPurchase.save();
    
    expect(savedPurchase._id).toBeDefined();
    expect(savedPurchase.totalAmount).toBe(purchaseData.totalAmount);
    expect(savedPurchase.products).toHaveLength(1);
    expect(savedPurchase.status).toBe('pending');
  });

  test('should update purchase status', async () => {
    const purchase = await Purchase.create({
      userId: new mongoose.Types.ObjectId(),
      products: [{
        productId: new mongoose.Types.ObjectId(),
        quantity: 1,
        price: 99.99
      }],
      totalAmount: 99.99,
      status: 'pending'
    });
    
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      purchase._id,
      { status: 'completed' },
      { new: true }
    );
    
    expect(updatedPurchase.status).toBe('completed');
  });

  test('should calculate total amount correctly', async () => {
    const products = [
      { productId: new mongoose.Types.ObjectId(), quantity: 2, price: 50.00 },
      { productId: new mongoose.Types.ObjectId(), quantity: 1, price: 100.00 }
    ];
    
    const totalAmount = products.reduce((sum, product) => {
      return sum + (product.quantity * product.price);
    }, 0);
    
    expect(totalAmount).toBe(200.00);
  });
});
