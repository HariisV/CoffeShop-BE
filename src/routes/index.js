const express = require("express");

const Router = express.Router();

// IMPORT ROUTE LIST
const authRoutes = require("../modules/auth/authRoutes");
const userRouters = require("../modules/users/userRouter");
const productRouters = require("../modules/product/productRouter");

// USER ROUTER LIST
Router.use("/auth", authRoutes);
Router.use("/user", userRouters);
Router.use("/product", productRouters);

module.exports = Router;
