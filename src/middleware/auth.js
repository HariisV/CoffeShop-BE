const jwt = require("jsonwebtoken");
const helperWrapper = require("../helper/wraper");
const redis = require("../config/redis");
require("dotenv").config();

module.exports = {
  authentication: (request, response, next) => {
    let token = request.headers.authorization;
    if (!token) {
      return helperWrapper.response(response, 403, `Please Login First`);
    }

    token = token.split(" ")[1];

    redis.get(`accessToken:${token}`, (error, result) => {
      if (!error && result !== null) {
        return helperWrapper.response(
          response,
          403,
          `Your Token Already Destroyed, Please Login Again`
        );
      }
    });
    jwt.verify(token, process.env.jwtKey, (error, result) => {
      if (error) {
        return helperWrapper.response(response, 403, error.message);
      }
      request.decodeToken = result;
      next();
    });

    console.log("Authentication process");
  },

  isAdmin: (request, response, next) => {
    if (request.decodeToken.role !== "admin") {
      return helperWrapper.response(
        response,
        400,
        "ONLY ADMIN THAT CAN DO THIS FEATURE"
      );
    }
    next();
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
