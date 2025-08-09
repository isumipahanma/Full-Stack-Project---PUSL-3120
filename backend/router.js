const express = require("express");
const router = express.Router();
const controller = require("./controller");
const userController = require("./userController");
const purchaseController = require("./purchaseController");

// Correct function name
router.get("/products", controller.getProducts);
router.post("/createproducts", controller.addProducts);
router.post("/updateproducts", controller.updateProducts);
router.post("/deleteproducts", controller.deleteProducts);

// User Routes
router.get("/userdata", userController.getUserData);
router.post("/adduserdata", userController.addUserData);
router.post("/updateuserdata", userController.updateUserData);
router.post("/deleteuserdata", userController.deleteUserData);

// Purchase Routes
router.get("/purchase", purchaseController.getPurchases);
router.post("/addpurchasedata", purchaseController.addPurchase);
router.post("/updatepurchasedata", purchaseController.updatePurchase);
router.post("/deletepurchasedata", purchaseController.deletePurchase);

// Add the missing route

module.exports = router;
