const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: String,
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
});

const User = mongoose.model("userdata", UserSchema);

module.exports = User;
