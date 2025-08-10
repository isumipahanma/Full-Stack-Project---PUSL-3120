# 🧪 Testing Guide for E-commerce Project

This guide covers the comprehensive testing setup for both backend and frontend components of the e-commerce application.

## 📋 Table of Contents

- [Overview](#overview)
- [Backend Testing](#backend-testing)
- [Frontend Testing](#frontend-testing)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Writing Tests](#writing-tests)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The project includes a comprehensive testing suite with:
- **Backend Tests**: Unit tests for models, controllers, and API routes
- **Frontend Tests**: Component tests, integration tests, and user interaction tests
- **Test Utilities**: Mock data generators and helper functions
- **Automated Test Runner**: PowerShell script for running all tests

## 🚀 Backend Testing

### Test Structure
```
backend/
├── __tests__/
│   ├── models.test.js          # Database model tests
│   ├── controllers.test.js     # Business logic tests
│   ├── routes.test.js          # API endpoint tests
│   └── server.test.js          # Server integration tests
├── jest.config.js              # Jest configuration
└── package.json                # Test scripts and dependencies
```

### Test Categories

#### 1. Model Tests (`models.test.js`)
- **Product Model**: CRUD operations, validation, schema requirements
- **User Model**: User creation, authentication, duplicate prevention
- **Purchase Model**: Order processing, status updates, calculations

#### 2. Controller Tests (`controllers.test.js`)
- **Product Controller**: Product management, filtering, stock updates
- **User Controller**: Registration, login, user management
- **Purchase Controller**: Order creation, status management

#### 3. Route Tests (`routes.test.js`)
- **API Endpoints**: HTTP methods, request/response handling
- **Error Handling**: Invalid data, missing resources, server errors
- **Authentication**: Protected routes, user validation

### Running Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

## 🎨 Frontend Testing

### Test Structure
```
frontend/src/
├── __tests__/
│   ├── components/
│   │   ├── ProductCard.test.jsx    # Product display component
│   │   ├── Cart.test.jsx           # Shopping cart component
│   │   └── ...
│   ├── auth/
│   │   ├── LoginPage.test.jsx      # Authentication forms
│   │   └── ...
│   ├── pages/
│   │   ├── HomePage.test.jsx       # Main page functionality
│   │   └── ...
│   └── utils/
│       └── test-utils.jsx          # Test utilities and mocks
├── setupTests.js                   # Test configuration
└── jest.config.js                  # Jest configuration
```

### Test Categories

#### 1. Component Tests
- **Rendering**: Component displays correctly with props
- **User Interactions**: Button clicks, form submissions, navigation
- **State Management**: Component state changes, data updates
- **Error Handling**: Invalid inputs, API failures, edge cases

#### 2. Integration Tests
- **API Integration**: Data fetching, error handling
- **Routing**: Navigation between pages, URL changes
- **State Persistence**: Local storage, session management

#### 3. User Experience Tests
- **Accessibility**: Screen reader support, keyboard navigation
- **Responsiveness**: Mobile/desktop layouts, breakpoints
- **Performance**: Loading states, error boundaries

### Running Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI/CD
npm run test:ci

# Debug tests
npm run test:debug
```

## 🏃‍♂️ Running Tests

### Using the Test Runner Script

The project includes a PowerShell script for running all tests:

```powershell
# Run all tests (backend + frontend)
.\scripts\run-tests.ps1

# Run only backend tests
.\scripts\run-tests.ps1 -Environment backend

# Run only frontend tests
.\scripts\run-tests.ps1 -Environment frontend

# Run tests with coverage
.\scripts\run-tests.ps1 -Coverage

# Run frontend tests in watch mode
.\scripts\run-tests.ps1 -Environment frontend -Watch

# Show help
.\scripts\run-tests.ps1 -Help
```

### Manual Test Execution

#### Backend Tests
```bash
# Install dependencies
cd backend
npm install

# Run tests
npm test

# Generate coverage report
npm run test:coverage
```

#### Frontend Tests
```bash
# Install dependencies
cd frontend
npm install

# Run tests
npm test

# Generate coverage report
npm run test:coverage
```

## 📊 Test Coverage

### Coverage Goals
- **Backend**: 80%+ coverage for models, controllers, and routes
- **Frontend**: 70%+ coverage for components and pages
- **Overall**: 75%+ project coverage

### Coverage Reports
- **HTML Reports**: Generated in `coverage/` directories
- **Console Output**: Summary in terminal after test runs
- **CI Integration**: Coverage thresholds enforced in CI/CD

## ✍️ Writing Tests

### Backend Test Structure

```javascript
describe('Component Name', () => {
  beforeEach(() => {
    // Setup test data and mocks
  });

  afterEach(() => {
    // Clean up after each test
  });

  test('should perform expected behavior', async () => {
    // Arrange: Set up test data
    const testData = { /* ... */ };
    
    // Act: Execute the function being tested
    const result = await functionToTest(testData);
    
    // Assert: Verify the expected outcome
    expect(result).toBeDefined();
    expect(result.property).toBe(expectedValue);
  });
});
```

### Frontend Test Structure

```javascript
describe('ComponentName', () => {
  const mockProps = {
    // Mock props for the component
  };

  const mockFunctions = {
    // Mock functions passed as props
  };

  test('renders correctly', () => {
    render(<ComponentName {...mockProps} {...mockFunctions} />);
    
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('handles user interactions', async () => {
    render(<ComponentName {...mockProps} {...mockFunctions} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockFunctions.onClick).toHaveBeenCalled();
  });
});
```

### Best Practices

1. **Test Naming**: Use descriptive test names that explain the expected behavior
2. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
3. **Mock External Dependencies**: Mock APIs, databases, and external services
4. **Test Edge Cases**: Include tests for error conditions and boundary values
5. **Keep Tests Fast**: Avoid slow operations and unnecessary setup

## 🔧 Test Configuration

### Jest Configuration

#### Backend (`backend/jest.config.js`)
- **Environment**: Node.js
- **Coverage**: HTML, LCOV, and text reports
- **Test Timeout**: 10 seconds
- **Mock Handling**: Automatic mock restoration

#### Frontend (`frontend/jest.config.js`)
- **Environment**: jsdom (browser simulation)
- **Coverage**: 70% threshold enforcement
- **Module Mapping**: CSS and asset file mocking
- **Transform**: Babel support for modern JavaScript

### Environment Variables

```bash
# Backend test environment
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/test

# Frontend test environment
REACT_APP_API_URL=http://localhost:3001/api
CI=true
```

## 🚨 Troubleshooting

### Common Issues

#### Backend Tests
1. **MongoDB Connection**: Ensure MongoDB is running or use in-memory database
2. **Port Conflicts**: Check if test server ports are available
3. **Dependencies**: Run `npm install` to ensure all packages are installed

#### Frontend Tests
1. **Module Resolution**: Check import paths and file extensions
2. **CSS Modules**: Ensure CSS mocks are properly configured
3. **Async Operations**: Use `waitFor` for asynchronous test operations

### Debug Mode

```bash
# Backend debug
cd backend
npm run test:debug

# Frontend debug
cd frontend
npm run test:debug
```

### Verbose Output

```bash
# Enable verbose Jest output
npm test -- --verbose

# Show test coverage details
npm run test:coverage -- --verbose
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

## 🤝 Contributing

When adding new features or components:

1. **Write Tests First**: Follow TDD principles when possible
2. **Maintain Coverage**: Ensure new code has adequate test coverage
3. **Update Test Files**: Add tests for new functionality
4. **Run All Tests**: Verify existing tests still pass

---

**Happy Testing! 🎉**
