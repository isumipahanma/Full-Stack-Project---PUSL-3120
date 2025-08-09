const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  id: Number,
  title: String,
  category: String,
  price: Number,
  rating: Number,
  imageUrl: String,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
// Compare this snippet from controller.js:
// const Product = require("./model");
