const express = require("express");
const Router = express.Router();
const transactionController = require("./transactionController");
const authMiddleware = require("../../middleware/auth");

Router.post(
  "/midtrans-notification",
  transactionController.postTrasnactionNotifMidtrans
);
Router.get("/generate/:id", transactionController.generateHistoryTransaction);
Router.get(
  "/detail/pending",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  transactionController.getTransactionDetailByPending
);
Router.get(
  "/detail/get-user/:id",
  authMiddleware.authentication,
  transactionController.getTransactionDetailByUserId
);
Router.get(
  "/get-user/:id",
  authMiddleware.authentication,
  transactionController.getTransactionByUserId
);
Router.get(
  "/:id",
  authMiddleware.authentication,
  transactionController.getTransactionById
);

Router.post(
  "/detail",
  authMiddleware.authentication,
  transactionController.postTransactionDetail
);

Router.patch(
  "/detail/:id",
  authMiddleware.authentication,
  transactionController.updateTransactionDetail
);
Router.delete(
  "/detail/:id",
  authMiddleware.authentication,
  transactionController.deleteTransactionDetail
);

module.exports = Router;
