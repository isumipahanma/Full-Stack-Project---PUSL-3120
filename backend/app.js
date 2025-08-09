const express = require("express");
const app = express();
const cors = require("cors");
const controller = require("./controller");
const userController = require("./userController");

app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.get("/products", (req, res) => {
  controller.getProducts((req, res, next) => {
    res.send();
  });
});

app.post("/createproducts", (req, res) => {
  controller.addProducts(req.body, (callack) => {
    res.send();
  });
});

app.post("/deleteproducts", (req, res) => {
  controller.deleteProducts(req.body, (callack) => {
    res.send(callack);
  });
});

app.post("/updateproducts", (req, res) => {
  controller.updateProducts(req.body, (callack) => {
    res.send(callack);
  });
});

// User Data Endpoints
app.get("/userdata", (req, res) => {
  userController.getUserData((data) => {
    res.send(data);
  });
});

app.post("/adduserdata", (req, res) => {
  userController.addUserData(req.body, (result) => {
    res.send(result);
  });
});

app.delete("/deleteuserdata", (req, res) => {
  userController.deleteUserData(req.body, (result) => {
    res.send(result);
  });
});

app.put("/updateuserdata", (req, res) => {
  userController.updateUserData(req.body, (result) => {
    res.send(result);
  });
});

// Purchase Data Endpoints
app.get("/purchase", (req, res) => {
  userController.getPurchaseData((data) => {
    res.send(data);
  });
});

app.post("/addpurchase", (req, res) => {
  userController.addPurchaseData(req.body, (result) => {
    res.send(result);
  });
});

app.delete("/deletepurchase", (req, res) => {
  userController.deletePurchaseData(req.body, (result) => {
    res.send(result);
  });
});

app.put("/updatepurchase", (req, res) => {
  userController.updatePurchaseData(req.body, (result) => {
    res.send(result);
  });
});

module.exports = app;
