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
        "SELECT product.nameProduct, product.image, transaction_detail.user_id,transaction_detail.id,transaction_detail.paymentMethod,transaction_detail.alamat,transaction_detail.nameReceiver,transaction_detail.noTelpReceiver,transaction_detail.totalPayment,transaction_detail.discount, transaction.product_id,transaction.quantity,transaction.size, transaction.totalPayment as totalItemPayment FROM transaction_detail JOIN transaction ON transaction_detail.id = transaction.transactiondetail_id JOIN product on transaction.product_id = product.id WHERE transaction_detail.statusTransaction = 'pending'",
        id,
        (error, results) => {
          if (!error) {
            const newResult = [];
            results.forEach((item) => {
              newResult.push({
                product: [
                  {
                    nameProduct: item.nameProduct,
                    image: item.image,
                    size: item.size,
                    quantity: item.quantity,
                    totalItemPayment: item.totalItemPayment,
                  },
                ],
                paymentMethod: item.paymentMethod,
                alamat: item.alamat,
                nameReceiver: item.nameReceiver,
                discount: item.discount,
                id: item.id,
                noTelpReceiver: item.noTelpReceiver,
                totalPayment: item.totalPayment,
                user_id: item.user_id,
                product_id: item.product_id,
              });
            });
            resolve(newResult);
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
      connection.query(
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
};
