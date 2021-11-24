const multer = require("multer");
const helperWrapper = require("../helper/wraper");

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, "public/upload/vouchers");
	},
	filename(req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype == "image/png" ||
		file.mimetype == "image/jpg" ||
		file.mimetype == "image/jpeg"
	) {
		cb(null, true);
	} else {
		cb({ message: "File Extension Not Allowed" }, false);
	}
};

const limits = { fileSize: 2 * 1024 * 1024 };

const upload = multer({ storage, fileFilter, limits }).single("image");

const uploadFilter = (request, response, next) => {
	upload(request, response, (err) => {
		if (err instanceof multer.MulterError) {
			return helperWrapper.response(response, 401, err.message, null);
		}
		if (err) {
			return helperWrapper.response(response, 401, err.message, null);
		}
		next();
	});
};

module.exports = uploadFilter;
