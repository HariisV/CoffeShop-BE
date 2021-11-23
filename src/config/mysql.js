const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_database,
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("You're now connected db mysql ...");
});

module.exports = connection;
