# E-Commerce Full-Stack Application

## 📋 **Project Overview**
A modern, full-stack e-commerce web application built with React.js, Node.js, MongoDB, and Socket.IO for real-time functionality.

## 🏗️ **Architecture**
- **Frontend**: React.js with modern UI/UX design
- **Backend**: Node.js + Express.js REST API
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO WebSocket implementation
- **Containerization**: Docker support for both frontend and backend

## ✨ **Features**
- 🛍️ **Product Management**: Full CRUD operations for products
- 👤 **User Authentication**: Login/Registration system
- 🛒 **Shopping Cart**: Add/remove items with real-time updates
- 👨‍💼 **Admin Dashboard**: Product management with real-time activity feed
- 🔔 **Real-time Notifications**: Live updates for product changes
- 📱 **Responsive Design**: Mobile-friendly pink-themed UI
- 🌐 **WebSocket Integration**: Real-time communication between client and server

## 🔄 **CI/CD Pipeline**

This project includes a comprehensive **Continuous Integration/Continuous Deployment (CI/CD)** pipeline using:

- **GitHub Actions** for automation
- **Docker** for containerization  
- **Automated testing** and security scanning
- **Multi-environment deployment** (staging/production)

For detailed CI/CD documentation, see: [CI_CD_IMPLEMENTATION.md](../CI_CD_IMPLEMENTATION.md)

### **Pipeline Features:**
- ✅ **Automated Testing**: Unit tests, integration tests, linting
- 🔒 **Security Scanning**: Dependency and container vulnerability scans
- 🐳 **Docker Builds**: Multi-stage optimized container images
- 🚀 **Auto Deployment**: Branch-based deployment to staging/production
- 📊 **Monitoring**: Health checks and observability

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
   ```bash
   git clone [YOUR_GITHUB_REPO_URL]
   cd coursework-group_73-main
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017`

5. **Run the Application**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm start
   # or
   node server.js
   ```
   Server will run on: `http://localhost:3001`

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm start
   ```
   Application will open on: `http://localhost:3000`

## 🐳 **Docker Deployment**

### **Option 1: Docker Compose (Recommended)**

**Development Environment:**
```bash
# Start all services with development configuration
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Services will be available at:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5000  
# - MongoDB: localhost:27017
# - Mongo Express (DB Admin): http://localhost:8081
# - Mailhog (Email Testing): http://localhost:8025
```

**Production Environment:**
```bash
# Start production services
docker-compose --profile production up

# Additional services:
# - Nginx: http://localhost:80
# - SSL/HTTPS: http://localhost:443
```

**With Monitoring:**
```bash
# Start with monitoring stack
docker-compose --profile monitoring up

# Additional monitoring services:
# - Prometheus: http://localhost:9090
# - Grafana: http://localhost:3001
```

### **Option 2: Individual Docker Builds**

**Backend:**
```bash
cd backend
docker build -t ecommerce-backend .
docker run -p 5000:5000 ecommerce-backend
```

**Frontend:**
```bash
cd frontend
docker build -t ecommerce-frontend .
docker run -p 3000:3000 ecommerce-frontend
```

## 📂 **Project Structure**

```
coursework-group_73-main/
├── backend/
│   ├── app.js                 # Express app configuration
│   ├── server.js             # Server entry point with Socket.IO
│   ├── controller.js         # Product CRUD operations
│   ├── model.js              # Product model
│   ├── userController.js     # User authentication
│   ├── userModel.js          # User model
│   ├── purchaseController.js # Purchase operations
│   ├── purchaseModel.js      # Purchase model
│   ├── router.js             # API routes
│   ├── package.json          # Backend dependencies
│   └── dockerfile            # Backend Docker configuration
├── frontend/
│   ├── src/
│   │   ├── ecommerce/
│   │   │   ├── admin/        # Admin dashboard components
│   │   │   ├── components/   # Reusable UI components
│   │   │   ├── context/      # Socket.IO context
│   │   │   ├── login/        # Authentication components
│   │   │   └── Profile/      # User profile components
│   │   ├── App.js            # Main application component
│   │   └── index.js          # Application entry point
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   └── dockerfile            # Frontend Docker configuration
├── .gitignore                # Git ignore rules
├── README.md                 # This file
└── WEBSOCKET_IMPLEMENTATION.md # WebSocket documentation
```

## 🔧 **API Endpoints**

### **Products**
- `GET /api/getproducts` - Get all products
- `POST /api/createproducts` - Create new product
- `POST /api/updateproducts` - Update existing product
- `POST /api/deleteproducts` - Delete product

### **Users**
- `GET /api/userdata` - Get user by email
- `POST /api/createuser` - Register new user
- `POST /api/updateuser` - Update user profile

### **Purchases**
- `GET /api/purchases` - Get all purchases
- `POST /api/createpurchase` - Create new purchase

## 🌐 **WebSocket Events**

### **Emitted Events (Client → Server)**
- `join-admin` - Join admin room
- `join-user` - Join user-specific room
- `product-created` - New product created
- `product-updated` - Product updated
- `product-deleted` - Product deleted
- `user-activity` - User activity tracking

### **Received Events (Server → Client)**
- `new-product` - New product notification
- `product-updated` - Product update notification
- `product-deleted` - Product deletion notification
- `new-purchase` - New purchase notification
- `user-activity` - Live user activity

## 👤 **Default Admin Credentials**
- **Email**: admin@gmail.com
- **Password**: admin123

## 🎨 **UI Features**
- Modern pink-themed design with gradients
- Glassmorphism effects and animations
- Responsive layout for all devices
- Real-time notification system
- Interactive product cards and forms
- Animated loading states and transitions

## 🧪 **Testing**
```bash
# Frontend tests
cd frontend
npm test

# Backend tests (when implemented)
cd backend
npm test
```

## 📚 **Technologies Used**

### **Frontend**
- React.js (v18.2.0)
- React Router DOM (v6.3.0)
- Axios (v1.6.0)
- Socket.IO Client (v4.8.1)
- Formik & Yup (Form validation)
- React Icons (v4.12.0)
- React Lottie (Animations)

### **Backend**
- Node.js
- Express.js (v4.21.2)
- MongoDB & Mongoose (v8.9.3)
- Socket.IO (v4.8.1)
- CORS (v2.8.5)

### **Development & Deployment**
- Docker & Docker Compose
- Nginx (Production frontend)
- Git & GitHub

## 🤝 **Contributing**
This is a coursework project. Please follow the university's academic integrity guidelines.

## 📄 **License**
This project is for educational purposes only.

## 🔗 **Live Demo**
[Add your deployed application URL here]

## 📞 **Contact**
[Add your contact information here]

---

**Note**: This application was developed as part of a full-stack development coursework project, demonstrating modern web development practices and real-time communication technologies. 