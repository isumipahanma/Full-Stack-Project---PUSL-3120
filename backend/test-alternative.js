const mongoose = require("mongoose");

// Try different connection string formats
const uri1 = `mongodb+srv://FullStack:12345678S@cluster0.0e8olu5.mongodb.net/?retryWrites=true&w=majority`;
const uri2 = `mongodb+srv://FullStack:12345678S@cluster0.0e8olu5.mongodb.net/ecommerce?retryWrites=true&w=majority`;
const uri3 = `mongodb+srv://FullStack:12345678S@cluster0.0e8olu5.mongodb.net/ecommerce`;

console.log("Testing connection string 1 (without database name):");
mongoose
  .connect(uri1)
  .then(() => {
    console.log("✅ Connected to MongoDB with uri1!");
    return mongoose.disconnect();
  })
  .catch((error) => {
    console.error("❌ Failed to connect with uri1:", error.message);
    
    console.log("\nTesting connection string 2 (with database name):");
    return mongoose.connect(uri2);
  })
  .then(() => {
    console.log("✅ Connected to MongoDB with uri2!");
    return mongoose.disconnect();
  })
  .catch((error) => {
    console.error("❌ Failed to connect with uri2:", error.message);
    
    console.log("\nTesting connection string 3 (minimal format):");
    return mongoose.connect(uri3);
  })
  .then(() => {
    console.log("✅ Connected to MongoDB with uri3!");
    mongoose.disconnect();
  })
  .catch((error) => {
    console.error("❌ Failed to connect with uri3:", error.message);
    console.log("\nAll connection attempts failed. Please check:");
    console.log("1. User credentials in MongoDB Atlas");
    console.log("2. Network access (IP whitelist)");
    console.log("3. Cluster status");
  }); 