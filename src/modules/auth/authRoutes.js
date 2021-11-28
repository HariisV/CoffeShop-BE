const express = require("express");

const Router = express.Router();
const authController = require("./authController");
const authMiddleware = require("../../middleware/auth");

Router.post("/login", authController.login);
Router.post("/register", authController.register);
Router.get("/activation/:id", authController.verifEmail);
Router.post("/forgot-password", authController.forgotPassword);
Router.post("/refresh-token", authController.refreshToken);
Router.patch(
  "/reset-password/:token",
  authMiddleware.getToken,
  authController.forgotPasswordUpdate
);
Router.post("/logout", authController.logout);
module.exports = Router;
