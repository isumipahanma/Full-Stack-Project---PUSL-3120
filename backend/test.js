const mongoose = require("mongoose");

const uri = `mongodb+srv://FullStack:12345678S@cluster0.0e8olu5.mongodb.net/ecommerce?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
