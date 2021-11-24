const express = require("express");
const Router = express.Router();
const productController = require("./productController");
const authMiddleware = require("../../middleware/auth");
const uploadImage = require("../../middleware/uploadProductImage");

Router.get("/", productController.getProduct);
Router.get("/getDetails/:id", productController.getProductDetail);

Router.post(
  "/",
  authMiddleware.isAdmin,
  uploadImage,
  productController.createProduct
);
Router.patch(
  "/:id",
  authMiddleware.isAdmin,
  uploadImage,
  productController.updateProduct
);

Router.delete("/:id", authMiddleware.isAdmin, productController.deleteProduct);

Router.get(
  "/favorite",
  authMiddleware.isAdmin,
  productController.getListFavorite
);

module.exports = Router;
