const helperWrapper = require("../../helper/wraper");
const userModel = require("./userModel");
const authModel = require("../auth/authModel");
const bcrypt = require("bcrypt");
const deleteFile = require("../../helper/file/delete");
require("dotenv").config();

module.exports = {
  getTransactionById: async (req, res) => {
    try {
      console.log("GET TRANSACTION BY ID");
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
  postTransaction: async (req, res) => {
    try {
      console.log("GET TRANSACTION BY ID");
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
  postTransactionDetail: async (req, res) => {
    try {
      const data = req.body;
      const user = req.decodeToken;

      console.log(data);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
};
