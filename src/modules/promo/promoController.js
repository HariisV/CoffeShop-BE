const helperResponse = require("../../helper/wraper");
const { v4: uuid } = require("uuid");
const moment = require("moment");
const deleteFile = require("../../helper/file/delete");
const promoModel = require("./promoModel");

module.exports = {
	getAllPromo: async function (request, response) {
		try {
			let { page, limit } = request.query;
			page = page ? parseInt(page) : 1;
			limit = limit ? parseInt(limit) : 4;
			const totalData = await promoModel.getTotalDataPromo();
			const totalPage = Math.ceil(totalData / limit);
			const offset = page * limit - limit;
			const pageInfo = {
				page,
				limit,
				totalPage,
				totalData,
			};
			const promo = await promoModel.getListPromo(limit, offset);
			helperResponse.response(
				response,
				200,
				"Success get data voucher!",
				promo,
				pageInfo
			);
		} catch (error) {
			helperResponse.response(response, 400, `Bad Request : ${error}`);
		}
	},
	createPromo: async function (request, response) {
		try {
			const {
				name,
				minTotalPrice,
				maxDiscount,
				promoCode,
				description,
				discount,
				startDate,
				endDate,
			} = request.body;

			const setDataNewPromo = {
				id: uuid(),
				name,
				minTotalPrice,
				maxDiscount,
				promoCode: promoCode.toUpperCase(),
				description,
				discount,
				image: request.file ? request.file.filename : null,
				startDate: moment(startDate).format("YYYY/MM/DD"),
				endDate: moment(endDate).format("YYYY/MM/DD"),
			};

			const validationPromo = promoCode.split("").length;
			if (validationPromo <= 6) {
				return helperResponse.response(
					response,
					409,
					"Promo Code Must Be Length 6!",
					null
				);
			}

			const newPromo = await promoModel.createNewPromo(setDataNewPromo);
			helperResponse.response(
				response,
				200,
				"Success Create new Promo",
				newPromo
			);
		} catch (error) {
			helperResponse.response(response, 400, `Bad Request : ${error}`);
		}
	},
	updatePromo: async function (request, response) {
		try {
			const { id } = request.params;
			const {
				name,
				minTotalPrice,
				maxDiscount,
				promoCode,
				description,
				discount,
				startDate,
				endDate,
			} = request.body;
			const setDataUpdatePromo = {
				name,
				minTotalPrice,
				maxDiscount,
				promoCode: promoCode.toUpperCase(),
				description,
				discount,
				startDate,
				endDate,
				image: request.file ? request.file.filename : null,
				updatedAt: new Date(Date.now()),
			};

			for (const data in setDataUpdatePromo) {
				if (setDataUpdatePromo[data] === "") {
					return helperResponse.response(
						response,
						409,
						"Please complete your input form."
					);
				}
			}

			const voucher = await promoModel.getVoucherById(id);
			if (voucher.length < 1) {
				return helperResponse.response(
					response,
					404,
					"Voucher cannot be found!",
					null
				);
			}
			if (voucher[0].image) {
				deleteFile(`vouchers/${voucher[0].image}`);
			}
			const newVoucher = await promoModel.updateNewPromo(
				setDataUpdatePromo,
				id
			);
			helperResponse.response(
				response,
				200,
				"Success update new promo",
				newVoucher
			);
		} catch (error) {
			return helperResponse.response(response, 400, `Bad Request : ${error}`);
		}
	},
	deletePromo: async function (request, response) {
		try {
			const { id } = request.params;
			const voucher = await promoModel.getVoucherById(id);
			if (voucher.length < 1) {
				return helperResponse.response(
					response,
					404,
					"Voucher cannot be found!",
					null
				);
			}
			if (voucher[0].image) {
				deleteFile(`vouchers/${voucher[0].image}`);
			}
			const removeVoucher = await promoModel.deleteVoucher(id);
			helperResponse.response(
				response,
				200,
				"Voucher has been deleted",
				removeVoucher
			);
		} catch (error) {
			return helperResponse.response(response, 400, `Bad Request : ${error}`);
		}
	},
};
