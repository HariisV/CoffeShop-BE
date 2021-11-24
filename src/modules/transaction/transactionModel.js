const connection = require("../../config/mysql");

module.exports = {
	getTransactionHistoryById: (id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT * FROM transaction_detail WHERE id = ?",
				id,
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						new Error(reject(`Message : ${error.message}`));
					}
				}
			);
		}),
};
