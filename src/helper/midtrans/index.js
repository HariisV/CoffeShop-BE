const midtransClient = require("midtrans-client");

let snap = new midtransClient.Snap({
	isProduction: false,
	serverKey: process.env.MIDTRANS_SERVER_KEY,
	clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = {
	createTransaction: (order_id, totalPayment) =>
		new Promise((resolve, reject) => {
			let parameterTranscation = {
				transaction_details: {
					order_id: order_id,
					gross_amount: totalPayment,
				},
				credit_card: {
					secure: true,
				},
			};

			snap
				.createTransaction(parameterTranscation)
				.then((transaction) => {
					console.log("please top up your payment.", transaction.redirect_url);
					resolve(transaction.redirect_url);
				})
				.catch((error) => {
					reject(`Error Midtrans Client : ${error}`);
				});
		}),

	notificationTransaction: (body) =>
		new Promise((resolve, reject) => {
			snap.transaction
				.notification(body)
				.then((statusResponse) => {
					const orderId = statusResponse.order_id;
					const transactionStatus = statusResponse.transaction_status;
					const fraudStatus = statusResponse.fraud_status;
					resolve({ orderId, transactionStatus, fraudStatus });
				})
				.catch((error) => reject(error));
		}),
};
