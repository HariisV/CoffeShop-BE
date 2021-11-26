const express = require("express");
const router = express.Router();
const promoController = require("./promoController");
const multer = require("../../middleware/uploadVoucheImage");

router.get("/", promoController.getAllPromo);
router.post("/new-promo", multer, promoController.createPromo);
router.patch("/update-promo/:id", multer, promoController.updatePromo);
router.delete("/delete-promo/:id", promoController.deletePromo);

module.exports = router;
