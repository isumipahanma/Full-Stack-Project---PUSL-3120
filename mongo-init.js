// MongoDB Initialization Script for E-commerce Application

// Switch to the ecommerce database
db = db.getSiblingDB('ecommerce');

// Create collections with validation
db.createCollection('products', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'price', 'category'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Product name is required and must be a string'
        },
        price: {
          bsonType: 'number',
          minimum: 0,
          description: 'Price must be a positive number'
        },
        category: {
          bsonType: 'string',
          description: 'Category is required and must be a string'
        },
        description: {
          bsonType: 'string',
          description: 'Product description'
        },
        image: {
          bsonType: 'string',
          description: 'Product image URL'
        },
        stock: {
          bsonType: 'number',
          minimum: 0,
          description: 'Stock quantity must be non-negative'
        }
      }
    }
  }
});

db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'name'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'Valid email address is required'
        },
        password: {
          bsonType: 'string',
          minLength: 6,
          description: 'Password must be at least 6 characters'
        },
        name: {
          bsonType: 'string',
          description: 'Name is required'
        },
        role: {
          bsonType: 'string',
          enum: ['user', 'admin'],
          description: 'Role must be either user or admin'
        }
      }
    }
  }
});

db.createCollection('purchases', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'products', 'totalAmount'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'User ID is required'
        },
        products: {
          bsonType: 'array',
          minItems: 1,
          description: 'At least one product is required'
        },
        totalAmount: {
          bsonType: 'number',
          minimum: 0,
          description: 'Total amount must be positive'
        }
      }
    }
  }
});

// Create indexes for better performance
db.products.createIndex({ "name": "text", "description": "text" });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "price": 1 });

db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });

db.purchases.createIndex({ "userId": 1 });
db.purchases.createIndex({ "createdAt": -1 });

// Insert sample data for development
db.products.insertMany([
  {
    name: "Wireless Headphones",
    price: 99.99,
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation",
    image: "headphones.jpg",
    stock: 50,
    createdAt: new Date()
  },
  {
    name: "Smart Watch",
    price: 199.99,
    category: "Electronics",
    description: "Feature-rich smartwatch with health monitoring",
    image: "smartwatch.jpg",
    stock: 30,
    createdAt: new Date()
  },
  {
    name: "Laptop Backpack",
    price: 49.99,
    category: "Accessories",
    description: "Durable laptop backpack with multiple compartments",
    image: "backpack.jpg",
    stock: 75,
    createdAt: new Date()
  }
]);

// Create admin user (password should be hashed in real application)
db.users.insertOne({
  email: "admin@ecommerce.com",
  password: "$2b$10$example.hashed.password", // This should be properly hashed
  name: "Admin User",
  role: "admin",
  createdAt: new Date()
});

print("✅ Database initialization completed successfully!");
print("📊 Created collections: products, users, purchases");
print("🔍 Created indexes for performance optimization");
print("📝 Inserted sample data for development");
print("👤 Created admin user: admin@ecommerce.com"); 