const helperResponse = require("../../helper/wraper");
const transactionModel = require("./transactionModel");
const path = require("path");
const ejs = require("ejs");
const htmlPdf = require("html-pdf");
const moment = require("moment");

module.exports = {
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
						helperResponse.response(
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
			console.log(dataGenerateTransaction);
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
										return helperResponse.response(
											response,
											400,
											error.message,
											null
										);
									} else {
										return helperResponse.response(
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
			return helperResponse.response(response, 400, `Bad Request : ${error}`);
		}
	},
};
