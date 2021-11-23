const express = require("express");

const Router = express.Router();

// IMPORT ROUTE LIST
const authRoutes = require("../modules/auth/authRoutes");

// USER ROUTER LIST
Router.use("/auth", authRoutes);

module.exports = Router;
