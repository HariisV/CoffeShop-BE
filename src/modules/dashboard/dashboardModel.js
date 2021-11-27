const connection = require("../../config/mysql");

module.exports = {
	getDashboard: (filter) =>
		new Promise((resolve, reject) => {
			const pp = connection.query(
				`SELECT SUM(totalPayment) As total
        FROM transaction_detail
        WHERE ${filter}(createdAt) = ${filter}(CURRENT_DATE())`,

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
};
