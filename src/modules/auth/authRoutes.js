const express = require("express");

const Router = express.Router();
const authController = require("./authController");

Router.post("/register", authController.register);
Router.patch("/activation/:id", authController.verifEmail);
module.exports = Router;
