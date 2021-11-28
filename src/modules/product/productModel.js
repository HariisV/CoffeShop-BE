const connection = require("../../config/mysql");

module.exports = {
  created: (data) =>
    new Promise((resolve, reject) => {
      const pp = connection.query(
        `INSERT INTO product set ?`,
        data,
        (error, result) => {
          if (!error) {
            resolve(data);
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
            const newResult = { id, ...data };
            resolve(newResult);
          } else {
            reject(new Error(`SQL : ${Error.sqlMessage}`));
          }
        }
      );
      console.log(pp.sql);
    }),

  getProductById: (data) =>
    new Promise((resolve, reject) => {
      const test = connection.query(
        `SELECT * FROM product WHERE id = ?`,
        data,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${Error.sqlMessage}`));
          }
        }
      );
      console.log(test.sql);
    }),

  getAllProduct: (search, sortField, sort, limit, offset, category) =>
    new Promise((resolve, reject) => {
      const test = connection.query(
        `SELECT * FROM product WHERE nameProduct LIKE '%${search}%'  ${
          category ? `AND category = "${category}"` : ""
        } ORDER BY ${sortField} ${sort} LIMIT ${limit} OFFSET ${offset}`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${Error.sqlMessage}`));
          }
        }
      );
      console.log(test.sql);
    }),

  deleteProduct: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM product WHERE id = ?",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),

  getDataCount: (search, category) =>
    new Promise((resolve, reject) => {
      const test = connection.query(
        `SELECT COUNT(*) as totalData FROM product WHERE nameProduct LIKE '%${search}%'  ${
          category ? `AND category = "${category}"` : ""
        }`,
        (error, result) => {
          if (!error) {
            resolve(result[0].totalData);
          } else {
            reject(new Error(`SQL : ${Error.sqlMessage}`));
          }
        }
      );
      console.log(test.sql);
    }),

  getFavoriteList: () =>
    new Promise((resolve, reject) => {
      const test = connection.query(
        `SELECT p.id, p.price, p.image, COUNT(td.product_id) as totalPurchase FROM transaction as td INNER JOIN product as p ON p.id=td.product_id GROUP BY p.id ORDER BY COUNT(td.product_id) DESC;`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${Error.sqlMessage}`));
          }
        }
      );
    }),
};
