const jwt = require("jsonwebtoken");
const helperWrapper = require("../helper/wraper");
const redis = require("../config/redis");
require("dotenv").config();

module.exports = {
  authentication: (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      return helperWrapper.response(res, 403, "Please login first !");
    }
    token = token.split(" ")[1];

    jwt.verify(token, process.env.jwtKey, (error, resultToken) => {
      if (
        (error && error.name === "JsonWebTokenError") ||
        (error && error.name === "TokenExpiredError")
      ) {
        return helperWrapper.response(res, 403, error.message);
      } else {
        redis.get(`accessToken:${token}`, (error, result) => {
          if (!error && result != null) {
            req.decodeToken = resultToken;
            next();
          } else {
            return helperWrapper.response(
              res,
              403,
              "Your token is destroyed please login again !"
            );
          }
        });
      }
    });
  },

  isAdmin: (request, response, next) => {
    let token = request.headers.authorization;
    if (!token) {
      return helperWrapper.response(res, 403, "Please login first !");
    }
    token = token.split(" ")[1];

    jwt.verify(token, process.env.jwtKey, (error, result) => {
      if (error) {
        return helperWrapper.response(response, 403, error.message);
      }
      request.decodeToken = result;
      if (request.decodeToken.role !== "admin") {
        return helperWrapper.response(
          response,
          403,
          "Only Admin To Acces This Request !"
        );
      } else if (request.decodeToken.role === "admin") {
        next();
      } else {
        return helperWrapper.response(
          response,
          403,
          "Error With Unknow Error !"
        );
      }
    });
  },
  getToken: (request, response, next) => {
    jwt.verify(request.params.token, process.env.jwtKey, (error, result) => {
      if (error) {
        return helperWrapper.response(response, 403, error.message);
      }
      request.decodeToken = result;
      next();
    });
  },
};
