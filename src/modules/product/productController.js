const helperWrapper = require("../../helper/wraper");
const { v4: uuidv4 } = require("uuid");
const productModel = require("./productModel");
const bcrypt = require("bcrypt");
const deleteFile = require("../../helper/file/delete");
require("dotenv").config();

module.exports = {
  getProduct: async (req, res) => {
    try {
      let { search, sortField, sort, page, limit, category } = req.query;
      console.log(search, sortField);
      page = Number(page);
      limit = Number(limit);

      search = !search ? "" : search;
      sortField = !sortField ? "nameProduct" : sortField;
      sort = !sort ? "ASC" : sort;
      page = !page ? 1 : page;
      limit = !limit ? 12 : limit;
      const offset = page * limit - limit;

      const totalData = await productModel.getDataCount(search, category);
      console.log(totalData);
      const totalPage = Math.ceil(totalData / limit);
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      if (page > totalPage) {
        return helperWrapper.response(res, 404, "Can't Show This Page");
      }

      let result = await productModel.getAllProduct(
        search,
        sortField,
        sort,
        limit,
        offset,
        category
      );

      if (result.length < 1) {
        return helperWrapper.response(res, 404, "Can't Find Any Data Product");
      }

      result = result.map((item) => {
        const data = {
          ...item,
          price: item.price.split(","),
        };
        return data;
      });

      return helperWrapper.response(
        res,
        200,
        `Success Get All Product`,
        result,
        pageInfo
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

  getProductDetail: async (req, res) => {
    try {
      const { id } = req.params;
      let result = await productModel.getProductById(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Can't Found Any Product Data With That Id`,
          null
        );
      }

      result = result.map((item) => {
        const data = {
          ...item,
          price: item.price.split(","),
        };
        return data;
      });

      return helperWrapper.response(
        res,
        200,
        `Success Get Details ${result[0].nameProduct}`,
        result[0]
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

      if (data.price.split(",").length < 3) {
        return helperWrapper.response(
          res,
          400,
          `Please Input Exactly 3 Price that separated with a coma (,) and without space. (priceR,priceL,priceXL)`,
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

      const cekProduct = await productModel.getProductById(id);

      if (cekProduct < 1) {
        return helperWrapper.response(
          res,
          404,
          `Can't Found Any Product Data With That Id`,
          null
        );
      }

      if (data.price) {
        if (data.price.split(",").length < 3) {
          return helperWrapper.response(
            res,
            400,
            `Please Input Exactly 3 Price that separated with a coma (,) and without space. (priceR,priceL,priceXL)`,
            null
          );
        }
      }

      let setData = {
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

      if (req && cekProduct[0].image) {
        deleteFile(`public/upload/product/${cekProduct[0].image}`);
      }

      let result = await productModel.updated(setData, id);

      // if (result.price) {
      //   result = { ...result, price: result.price.split(",") };
      // }

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

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const cekProduct = await productModel.getProductById(id);

      if (cekProduct < 1) {
        return helperWrapper.response(
          res,
          404,
          `Can't Found Any Product Data With That Id`,
          null
        );
      }

      const result = await productModel.deleteProduct(id);

      if (cekProduct[0].image) {
        deleteFile(`public/upload/product/${cekProduct[0].image}`);
      }

      let dataProduct = cekProduct[0];
      dataProduct = { ...dataProduct, price: dataProduct.price.split(",") };

      return helperWrapper.response(
        res,
        200,
        `Success Deleted a Product !`,
        dataProduct
      );
    } catch {
      return helperWrapper.response(
        res,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
};
