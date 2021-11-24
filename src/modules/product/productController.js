const helperWrapper = require("../../helper/wraper");
const { v4: uuidv4 } = require("uuid");
const productModel = require("./productModel");
const bcrypt = require("bcrypt");
// const deleteFile = require("../../helper/file/delete");
require("dotenv").config();

module.exports = {
  getProduct: async (req, res) => {
    try {
      console.log("GET TRANSACTION");
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
  getProductDetail: async (req, res) => {
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
  createProduct: async (req, res) => {
    try {
      const data = req.body;
      const file = req.file;
      if (
        !data.nameProduct ||
        !data.price ||
        !data.category ||
        !data.description ||
        !data.size
      ) {
        return helperWrapper.response(
          res,
          400,
          `Semua Input Harus Diisi`,
          null
        );
      }
      const setData = {
        id: uuidv4(),
        nameProduct: data.nameProduct,
        price: data.price,
        category: data.category,
        description: data.description,
        size: data.size,
        image: file.filename,
      };
      let result = await productModel.created(setData);
      return helperWrapper.response(
        res,
        200,
        `Success Created Product !`,
        result
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
  updateProduct: async (req, res) => {
    try {
      const data = req.body;
      const file = req.file;
      const { id } = req.params;

      let setData = {
        id: uuidv4(),
        nameProduct: data.nameProduct,
        price: data.price,
        category: data.category,
        description: data.description,
        size: data.size,
      };
      Object.keys(setData).forEach((element) => {
        if (!setData[element]) {
          delete setData[element];
        }
      });
      if (req.file) {
        setData = { ...setData, image: file.filename };
      }
      let result = await productModel.updated(setData, id);
      return helperWrapper.response(
        res,
        200,
        `Success Updated Product !`,
        result
      );
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
