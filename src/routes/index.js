const express = require("express");

const Router = express.Router();

// IMPORT ROUTE LIST
const authRoutes = require("../modules/auth/authRoutes");
const userRouters = require("../modules/users/userRouter");
const productRouters = require("../modules/product/productRouter");
const promoRoutes = require("../modules/promo/promoRoutes");
const transactionRoutes = require("../modules/transaction/transactionRoutes");
const DashboardRoutes = require("../modules/dashboard/dashboardRoutes");

// USER ROUTER LIST
Router.use("/user", userRouters);
Router.use("/auth", authRoutes);
Router.use("/promo", promoRoutes);
Router.use("/transaction", transactionRoutes);
Router.use("/product", productRouters);
Router.use("/dashboard", DashboardRoutes);

module.exports = Router;
