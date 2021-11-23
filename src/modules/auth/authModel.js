const connection = require("../../config/mysql");

module.exports = {
  checkUser: (email) =>
    new Promise((resolve, reject) => {
      const pp = connection.query(
        `SELECT * FROM users WHERE email = ?`,
        email,
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

  register: (data) =>
    new Promise((resolve, reject) => {
      const test = connection.query(
        `INSERT INTO users SET ?`,
        data,
        (error, result) => {
          if (!error) {
            const newResult = data;
            delete newResult.password;
            resolve(newResult);
          } else {
            reject(new Error(`SQL : ${Error.sqlMessage}`));
          }
        }
      );
      console.log(test.sql);
    }),
};
