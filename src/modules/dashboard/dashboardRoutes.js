const express = require("express");
const Router = express.Router();
const dashboardController = require("./dashboardController");
const authMiddleware = require("../../middleware/auth");

Router.get("/:filter", dashboardController.getDashboard);

module.exports = Router;
