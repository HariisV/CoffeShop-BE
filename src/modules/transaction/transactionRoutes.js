const express = require("express");
const router = express.Router();
const transactionController = require("./transactionController");

router.get("/generate/:id", transactionController.generateHistoryTransaction);

module.exports = router;
