import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Custom render function that includes providers
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Mock data generators
export const createMockProduct = (overrides = {}) => ({
  id: '1',
  name: 'Test Product',
  price: 99.99,
  description: 'A test product description',
  category: 'Electronics',
  image: 'test-image.jpg',
  stock: 10,
  ...overrides
});

export const createMockUser = (overrides = {}) => ({
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  ...overrides
});

export const createMockCartItem = (overrides = {}) => ({
  id: '1',
  name: 'Test Product',
  price: 99.99,
  quantity: 1,
  image: 'test-image.jpg',
  ...overrides
});

export const createMockPurchase = (overrides = {}) => ({
  id: '1',
  userId: 'user1',
  products: [createMockCartItem()],
  totalAmount: 99.99,
  status: 'pending',
  createdAt: new Date().toISOString(),
  ...overrides
});

// Mock API responses
export const mockApiResponse = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data))
});

export const mockApiError = (message = 'API Error', status = 500) => ({
  ok: false,
  status,
  json: () => Promise.reject(new Error(message)),
  text: () => Promise.reject(new Error(message))
});

// Test helpers
export const waitForElementToBeRemoved = (element) => {
  return new Promise((resolve) => {
    const checkElement = () => {
      if (!document.contains(element)) {
        resolve();
      } else {
        setTimeout(checkElement, 100);
      }
    };
    checkElement();
  });
};

export const mockLocalStorage = () => {
  const store = {};
  
  return {
    getItem: jest.fn((key) => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    })
  };
};

export const mockSessionStorage = () => {
  const store = {};
  
  return {
    getItem: jest.fn((key) => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    })
  };
};

// Mock fetch with predefined responses
export const mockFetch = (responses = {}) => {
  const defaultResponses = {
    '/api/products': mockApiResponse([]),
    '/api/categories': mockApiResponse([]),
    '/api/users/login': mockApiResponse({ token: 'mock-token' }),
    '/api/users/register': mockApiResponse({ success: true }),
    ...responses
  };

  global.fetch = jest.fn((url) => {
    const response = defaultResponses[url] || mockApiResponse({});
    return Promise.resolve(response);
  });
};

// Export custom render and other utilities
export * from '@testing-library/react';
export { customRender as render };
