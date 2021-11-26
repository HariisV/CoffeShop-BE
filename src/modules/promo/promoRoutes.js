const express = require("express");
const router = express.Router();
const promoController = require("./promoController");
const multer = require("../../middleware/uploadVoucheImage");
const auth = require("../../middleware/auth");

router.get("/", auth.authentication, promoController.getAllPromo);
router.post(
	"/new-promo",
	auth.authentication,
	auth.isAdmin,
	multer,
	promoController.createPromo
);
router.patch(
	"/update-promo/:id",
	auth.authentication,
	auth.isAdmin,
	multer,
	promoController.updatePromo
);
router.delete(
	"/delete-promo/:id",
	auth.authentication,
	auth.isAdmin,
	promoController.deletePromo
);

module.exports = router;
