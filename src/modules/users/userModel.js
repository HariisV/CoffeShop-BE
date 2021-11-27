const connection = require("../../config/mysql");

module.exports = {
  updateUser: (data, email) =>
    new Promise((resolve, reject) => {
      const pp = connection.query(
        `UPDATE users SET ? WHERE email = '${email}'`,
        data,
        (err, res) => {
          if (!err) {
            resolve(data);
          } else {
            reject(new Error(`SQL : ${err.sqlMessage}`));
          }
        }
      );
      console.log(pp.sql);
    }),
  getUserById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(`SELECT * from users WHERE id = '${id}'`, (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          reject(new Error(`SQL : ${err.sqlMessage}`));
        }
      });
    }),
};
