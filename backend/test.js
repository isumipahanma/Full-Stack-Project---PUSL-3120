const mongoose = require("mongoose");

const uri = `mongodb+srv://hesh:tharindu@cluster0.1wsjk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
