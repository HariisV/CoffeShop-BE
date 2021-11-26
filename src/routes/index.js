const express = require("express");

const Router = express.Router();

// IMPORT ROUTE LIST
const authRoutes = require("../modules/auth/authRoutes");
const userRouters = require("../modules/users/userRouter");
const productRouters = require("../modules/product/productRouter");
const promoRoutes = require("../modules/promo/promoRoutes");
const transactionRoutes = require("../modules/transaction/transactionRoutes");

// USER ROUTER LIST
Router.use("/auth", authRoutes);
Router.use("/promo", promoRoutes);
Router.use("/transaction", transactionRoutes);
Router.use("/product", productRouters);

module.exports = Router;
