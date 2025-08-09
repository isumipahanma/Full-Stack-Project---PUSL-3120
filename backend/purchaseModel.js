const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
  purchaseId: String, // Group items by purchaseId
  items: [
    {
      userid: String,
      id: String,
      title: String,
      size: String,
      quantity: Number,
      date: String,
      price: Number,
    },
  ],
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
