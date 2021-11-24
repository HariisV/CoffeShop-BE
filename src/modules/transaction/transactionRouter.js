const express = require("express");
const Router = express.Router();
const transactionController = require("./transactionController");
const authMiddleware = require("../../middleware/auth");

Router.get(
  "/transaction/:id",
  authMiddleware.authentication,
  transactionController.getTransactionById
);

Router.post(
  "/transaction",
  authMiddleware.authentication,
  transactionController.postTransaction
);
Router.post(
  "/transaction-detail",
  authMiddleware.authentication,
  transactionController.postTransactionDetail
);
