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
  getByWeek: (firstday, lastday) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT WEEK(createdAt) As total, SUM(totalPayment) As total FROM transaction_detail WHERE createdAt BETWEEN '${firstday}' AND '${lastday}'`,
        (error, results) => {
          if (!error) {
            resolve(results[0].total ? results[0].total : 0);
          } else {
            new Error(reject(`Message : ${error.message}`));
          }
        }
      );
    }),
  getByMonth: (month) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT MONTHNAME(createdAt) AS Month, SUM(totalPayment) AS total from transaction_detail WHERE MONTH(createdAt) = ${month}`,
        (error, results) => {
          if (!error) {
            resolve(results[0].total ? results[0].total : 0);
          } else {
            new Error(reject(`Message : ${error.message}`));
          }
        }
      );
    }),
  getByDay: (month) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT DAY(createdAt) AS DAY, SUM(totalPayment) AS total from transaction_detail WHERE MONTH(createdAt) = MONTH(NOW()) GROUP BY DAY(createdAt)`,
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
