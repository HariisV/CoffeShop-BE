const { v4: uuidv4 } = require("uuid");
const path = require("path");
const ejs = require("ejs");
const htmlPdf = require("html-pdf");
const moment = require("moment");
const helperWrapper = require("../../helper/wraper");
const transactionModel = require("./transactionModel");
const productModel = require("../product/productModel");
const promoModel = require("../promo/promoModel");
const {
	createTransaction,
	notificationTransaction,
} = require("../../helper/midtrans");
require("dotenv").config();
function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
	getTransactionById: async (req, res) => {
		try {
			console.log("GET TRANSACTION BY ID");
		} catch (error) {
			return helperWrapper.response(
				res,
				400,
				`Bad Request ${error.message}`,
				null
			);
		}
	},
	getTransactionByUserId: async (req, res) => {
		try {
			const { id } = req.params;
			const result = await transactionModel.getTransactionByUserId(id);
			return helperWrapper.response(
				res,
				200,
				`Success Get Transaction By User Id`,
				result
			);
		} catch (error) {
			return helperWrapper.response(
				res,
				400,
				`Bad Request ${error.message}`,
				null
			);
		}
	},
	getTransactionDetailByUserId: async (req, res) => {
		try {
			const { id } = req.params;
			const result = await transactionModel.getTransactionDetailByUserId(id);
			return helperWrapper.response(
				res,
				200,
				`Success Get Transaction Detail By User Id`,
				result
			);
		} catch (error) {
			return helperWrapper.response(
				res,
				400,
				`Bad Request ${error.message}`,
				null
			);
		}
	},
	getTransactionDetailByPending: async (req, res) => {
		try {
			const result = await transactionModel.getTransactionDetailByPending();
			return helperWrapper.response(
				res,
				200,
				`Success Get Transaction Pending`,
				result
			);
		} catch (error) {
			return helperWrapper.response(
				res,
				400,
				`Bad Request ${error.message}`,
				null
			);
		}
	},
	postTransactionDetail: async (req, res) => {
		try {
			const data = req.body;
			const user = req.decodeToken;
			let discount = 0;
			if (
				!data.totalPayment ||
				!data.paymentMethod ||
				!data.alamat ||
				!data.nameReceiver ||
				!data.noTelpReceiver
			) {
				return helperWrapper.response(
					res,
					400,
					`Semua Input Harus Diisi`,
					null
				);
			}
			if (data.voucher_id) {
				const checkVoucher = await promoModel.getVoucherById(data.voucher_id);
				if (checkVoucher.length < 1) {
					return helperWrapper.response(
						res,
						400,
						`Voucher Tidak Ditemukan`,
						null
					);
				} else if (data.totalPayment < checkVoucher[0].minTotalPrice) {
					return helperWrapper.response(
						res,
						400,
						`Total Payment Kurang untuk menggunakan voucher ini`,
						null
					);
				}
				discount = (checkVoucher[0].discount / 100) * data.totalPayment;
				if (discount > checkVoucher[0].maxDiscount) {
					discount = checkVoucher[0].maxDiscount;
				}
			}
			let total = data.totalPayment - discount;
			const setDataDetail = {
				id: `pd-${rand(1000, 9999)}${rand(10, 99)}${rand(10, 99)}`,
				user_id: user.id,
				voucher_id: data.voucher_id,
				totalPayment: total,
				discount: discount,
				paymentMethod: data.paymentMethod,
				alamat: data.alamat,
				nameReceiver: data.nameReceiver,
				noTelpReceiver: data.noTelpReceiver,
				status: "pending",
			};

			const postTransactionDetail =
				await transactionModel.postTransactionDetail(setDataDetail);

			data.product.forEach(async (item) => {
				let product = await productModel.getProductById(item.product_id);
				let priceProduct = product[0].price.split(",");
				let price = {
					R: priceProduct[0],
					L: priceProduct[1],
					XL: priceProduct[2],
				};
				let pricePerQty =
					item.size == "R" || item.size == "250"
						? price.R
						: item.size == "L" || item.size == "300"
						? price.L
						: item.size == "XL" || item.size == "500"
						? price.XL
						: 0;

				const setDataTransaction = {
					id: uuidv4(),
					user_id: user.id,
					product_id: item.product_id,
					transactiondetail_id: setDataDetail.id,
					quantity: item.quantity,
					size: item.size,
					totalPayment: pricePerQty * item.quantity,
				};
				await transactionModel.postTransaction(setDataTransaction);
			});
			const midtransNotif = await createTransaction(
				setDataDetail.id,
				setDataDetail.totalPayment
			);
			return helperWrapper.response(res, 200, "Please complete your payment.", {
				redirectUrl: midtransNotif,
			});
		} catch (error) {
			return helperWrapper.response(
				res,
				400,
				`Bad Request ${error.message}`,
				null
			);
		}
	},
	updateTransactionDetail: async (req, res) => {
		try {
			const { id } = req.params;
			const data = req.body;
			const transactionDetail =
				await transactionModel.getTransactionHistoryById(id);
			if (transactionDetail.length < 1) {
				return helperWrapper.response(res, 400, `Data Tidak Ditemukan`, null);
			}
			const setData = {
				status: data.statusTransaction,
			};
			// console.log(id, data, setData);
			await transactionModel.updateTransactionHistory(setData, id);
			return helperWrapper.response(
				res,
				200,
				`Success Update Status Transaction !`,
				setData
			);
		} catch (error) {
			return helperWrapper.response(
				res,
				400,
				`Bad Request ${error.message}`,
				null
			);
		}
	},
	deleteTransactionDetail: async (req, res) => {
		try {
			const { id } = req.params;
			await transactionModel.deleteTransaction(id);
			await transactionModel.deleteTransactionDetail(id);
			return helperWrapper.response(
				res,
				200,
				`Success Delete Transaction !`,
				null
			);
		} catch (error) {
			return helperWrapper.response(
				res,
				400,
				`Bad Request ${error.message}`,
				null
			);
		}
	},
	generateHistoryTransaction: async function (request, response) {
		try {
			const { id } = request.params;
			const fileName = `report-transaction-${id}.pdf`;
			const transaction = await transactionModel.getTransactionHistoryById(id);

			// Filter Transaction === Success
			const transactionSuccess = transaction
				.filter((value) => {
					if (value.statusTransaction === "Success") {
						return value.statusTransaction;
					} else {
						helperWrapper.response(
							response,
							404,
							"Cannot find history transaction!",
							null
						);
					}
				})
				.map((data) => {
					const setNewData = {
						...data,
						dateTransaction: moment(data.dateTransaction).format("LLL"),
						noTelpReceiver: `+62${data.noTelpReceiver}`,
					};
					return setNewData;
				});

			// GENERATE PDF
			const dataGenerateTransaction = transactionSuccess[0];
			ejs.renderFile(
				path.resolve("./src/template/generate/transaction.ejs"),
				{ dataGenerateTransaction },
				(error, results) => {
					if (!error) {
						let options = {
							height: "11.25in",
							width: "10.5in",
						};
						htmlPdf
							.create(results, options)
							.toFile(
								path.resolve(`./public/upload/generate/${fileName}`),
								(error, results) => {
									if (error) {
										return helperWrapper.response(
											response,
											400,
											error.message,
											null
										);
									} else {
										return helperWrapper.response(
											response,
											200,
											"Success generate history transaction.",
											{
												redirect_url: `http://localhost:3001/upload/generate/${fileName}`,
											}
										);
									}
								}
							);
					}
				}
			);
		} catch (error) {
			return helperWrapper.response(response, 400, `Bad Request : ${error}`);
		}
	},
	postTrasnactionNotifMidtrans: async (request, response) => {
		try {
			const notifMidtrans = await notificationTransaction(request.body);
			const { order_id, transactionStatus, fraudStatus } = notifMidtrans;

			if (transactionStatus === "capture") {
				if (fraudStatus === "challenge") {
					await transactionModel.updateStatusTransaction({
						status: "challange",
						id: order_id,
						updatedAt: new Date(),
					});
				} else if (fraudStatus === "accept") {
					await transactionModel.updateStatusTransaction({
						status: "success",
						id: order_id,
						updatedAt: new Date(),
					});
				}
			} else if (transactionStatus === "settlement") {
				await transactionModel.updateStatusTransaction({
					status: "success",
					id: order_id,
					updatedAt: new Date(),
				});
			} else if (transactionStatus === "deny") {
				await transactionModel.updateStatusTransaction({
					status: "success",
					id: order_id,
					updatedAt: new Date(),
				});
			} else if (
				transactionStatus === "cancel" ||
				transactionStatus === "expire"
			) {
				await transactionModel.updateStatusTransaction({
					status: "failure",
					id: order_id,
					udpatedAt: new Date(),
				});
			} else if (transactionStatus === "pending") {
				await transactionModel.updateStatusTransaction({
					status: "pending",
					id: order_id,
					udpatedAt: new Date(),
				});
			}

			return helperWrapper.response(
				response,
				200,
				"Transaction Successfully.",
				notifMidtrans
			);
		} catch (error) {
			helperWrapper.response(response, 400, `Bad Request : ${error}`);
		}
	},
};
