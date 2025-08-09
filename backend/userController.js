const UserModel = require("./userModel");

// Get all users
// Get user by email
const getUserData = (req, res, next) => {
  const email = req.query.email; // Get the email from the request query parameters

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  UserModel.findOne({ email: email }) // Use findOne to get a single user by email
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.json({ response: user });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

// Add a new user
const addUserData = (req, res, next) => {
  const newUser = new UserModel({
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  newUser
    .save()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};

// Update user data
const updateUserData = (req, res, next) => {
  const { id, name, email, password } = req.body;
  UserModel.updateOne(
    { id: id },
    { name: name, email: email, password: password }
  )
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};

// Delete a user
const deleteUserData = (req, res, next) => {
  const id = req.body.id;
  UserModel.deleteOne({ id: id })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};

exports.getUserData = getUserData;
exports.addUserData = addUserData;
exports.updateUserData = updateUserData;
exports.deleteUserData = deleteUserData;
