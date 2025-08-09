const express = require("express");
const app = express();
const cors = require("cors");
const port = 3001;
const host = "localhost";
const mongoose = require("mongoose");
const router = require("./router");
const http = require("http");
const socketIo = require("socket.io");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://dunidu:12345678D@cluster0.0ko9ljb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to the database!");
  } catch (error) {
    console.log("Could not connect to the database!", error);
  }
};

connect();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join admin room for admin-specific updates
  socket.on("join-admin", () => {
    socket.join("admin-room");
    console.log("Admin joined admin room");
  });

  // Join user room for user-specific updates
  socket.on("join-user", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Handle new product creation
  socket.on("product-created", (product) => {
    // Notify all connected clients about new product
    io.emit("new-product", product);
    console.log("New product created:", product.title);
  });

  // Handle product updates
  socket.on("product-updated", (product) => {
    io.emit("product-updated", product);
    console.log("Product updated:", product.title);
  });

  // Handle product deletion
  socket.on("product-deleted", (productId) => {
    io.emit("product-deleted", productId);
    console.log("Product deleted:", productId);
  });

  // Handle new purchase
  socket.on("purchase-created", (purchase) => {
    // Notify admin about new purchase
    io.to("admin-room").emit("new-purchase", purchase);
    console.log("New purchase created:", purchase.purchaseId);
  });

  // Handle cart updates
  socket.on("cart-updated", (data) => {
    // Notify specific user about cart updates
    io.to(`user-${data.userId}`).emit("cart-updated", data);
    console.log("Cart updated for user:", data.userId);
  });

  // Handle user activity
  socket.on("user-activity", (activity) => {
    // Notify admin about user activity
    io.to("admin-room").emit("user-activity", activity);
    console.log("User activity:", activity);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io available to other modules
app.set("io", io);

server.listen(port, host, () => {
  console.log(`Express is running on port ${server.address().port}`);
});

app.use("/api", router);
