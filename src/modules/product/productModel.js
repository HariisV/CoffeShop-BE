const connection = require("../../config/mysql");

module.exports = {
  created: (data) =>
    new Promise((resolve, reject) => {
      const pp = connection.query(
        `INSERT INTO product set ?`,
        data,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${Error.sqlMessage}`));
          }
        }
      );
      console.log(pp.sql);
    }),
  updated: (data, id) =>
    new Promise((resolve, reject) => {
      const pp = connection.query(
        `UPDATE product SET ? WHERE ID = ?`,
        [data, id],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${Error.sqlMessage}`));
          }
        }
      );
      console.log(pp.sql);
    }),
};
