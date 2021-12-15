const express = require("express");
const Router = express.Router();
const userMiddleware = require("../../middleware/uploadUserImage");
const userController = require("./userController");
const authMiddleware = require("../../middleware/auth");

Router.get("/:id", userController.getUserById);
Router.patch(
	"/update",
	authMiddleware.authentication,
	userController.updateProfile
);
Router.patch(
	"/update/password",
	authMiddleware.authentication,
	userController.updatePassword
);
Router.patch(
	"/update/image",
	userMiddleware,
	authMiddleware.authentication,
	userController.updateImage
);
Router.patch(
	"/image/delete",
	authMiddleware.authentication,
	userController.deleteImage
);
module.exports = Router;
