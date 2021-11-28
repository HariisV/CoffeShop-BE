const connection = require("../../config/mysql");

module.exports = {
	getTransactionByUserId: (id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT * FROM transaction WHERE user_id = ?",
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
	getTransactionDetailByUserId: (id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT * FROM transaction_detail WHERE user_id = ?",
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
	getTransactionDetailByPending: (id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT * FROM transaction_detail WHERE statusTransaction = 'pending'",
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
	getTransactionById: (id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT * FROM transaction WHERE id = ?",
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
	postTransaction: (data) =>
		new Promise((resolve, reject) => {
			connection.query(
				"INSERT INTO transaction SET ?",
				data,
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						new Error(reject(`Message : ${error.message}`));
					}
				}
			);
		}),
	postTransactionDetail: (data) =>
		new Promise((resolve, reject) => {
			const query = connection.query(
				"INSERT INTO transaction_detail SET ?",
				data,
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						new Error(reject(`Message : ${error.message}`));
					}
				}
			);
			console.log(query.sql);
		}),
	updateTransactionHistory: (data, id) =>
		new Promise((resolve, reject) => {
			connection.query(
				`UPDATE transaction_detail SET ? WHERE id = '${id}'`,
				data,
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						new Error(reject(`Message : ${error.message}`));
					}
				}
			);
		}),
	deleteTransaction: (id) =>
		new Promise((resolve, reject) => {
			const pp = connection.query(
				`DELETE from transaction WHERE transactiondetail_id = '${id}'`,
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						new Error(reject(`Message : ${error.message}`));
					}
				}
			);
			console.log(pp.sql);
		}),
	deleteTransactionDetail: (id) =>
		new Promise((resolve, reject) => {
			const pp = connection.query(
				`DELETE from transaction_detail WHERE id = '${id}'`,
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						new Error(reject(`Message : ${error.message}`));
					}
				}
			);
			console.log(pp.sql);
		}),
	updateStatusTransaction: (status, id) =>
		new Promise((resolve, reject) => {
			const query = connection.query(
				`UPDATE transaction_detail SET statusTransaction = '${status.status}' WHERE id = '${status.id}'`,
				(error, results) => {
					if (!error) {
						resolve(null);
					} else {
						reject(new Error(`Message : ${error.message}`));
					}
				}
			);
			console.log(query.sql);
		}),
};
