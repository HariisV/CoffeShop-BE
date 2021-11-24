const connection = require("../../config/mysql");

module.exports = {
	getListPromo: (limit, offset) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT * FROM vouchers LIMIT ? OFFSET ?",
				[limit, offset],
				(error, result) => {
					if (!error) {
						resolve(result);
					} else {
						new Error(reject(`Message : ${error.message}`));
					}
				}
			);
		}),

	getVoucherById: (id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT * FROM vouchers WHERE id = ?",
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
	getTotalDataPromo: () =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT COUNT(*) as total FROM vouchers",
				(error, results) => {
					if (!error) {
						resolve(results[0].total);
					} else {
						new Error(reject(`Message : ${error.message}`));
					}
				}
			);
		}),

	createNewPromo: (data) =>
		new Promise((resolve, reject) => {
			connection.query("INSERT INTO vouchers SET ?", data, (error, results) => {
				if (!error) {
					const setNewResults = {
						...data,
					};
					resolve(setNewResults);
				} else {
					new Error(reject(`Message : ${error.message}`));
				}
			});
		}),
	updateNewPromo: (data, id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"UPDATE vouchers SET ? WHERE id = ?",
				[data, id],
				(error, results) => {
					if (!error) {
						const newDataUpdate = {
							id,
						};
						resolve(newDataUpdate);
					} else {
						new Error(reject(`Message : ${error.message}`));
					}
				}
			);
		}),
	deleteVoucher: (id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"DELETE FROM vouchers WHERE id = ?",
				id,
				(error, results) => {
					const data = {
						id,
					};
					if (!error) {
						resolve(data);
					} else {
						new Error(reject(`Message : ${error.message}`));
					}
				}
			);
		}),
};
