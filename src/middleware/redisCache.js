const { response } = require("express");
const redis = require("../config/redis");
const helperWraper = require("../helper/wraper");

module.exports = {
  getMovieById: (request, response, next) => {
    const { id } = request.params;
    redis.get(`getMovie:${id}`, (error, result) => {
      if (!error && result !== null) {
        console.log("Data dari Redis");
        const newResult = JSON.parse(result);
        return helperWraper.response(
          response,
          200,
          `Success Get Data By id`,
          newResult
        );
      } else {
        console.log("Data tidak ada di Redis");
        next();
      }
    });
  },
  getMovieRedis: (request, response, next) => {
    redis.get(`getMovie:${JSON.stringify(request.query)}`, (error, result) => {
      if (!error && result !== null) {
        console.log("Data dari Redis");
        const newResult = JSON.parse(result);
        return helperWraper.response(
          response,
          200,
          `Success Get Data`,
          newResult.result,
          newResult.pageInfo
        );
      } else {
        console.log("Data tidak ada di Redis");
        next();
      }
    });
  },
  clearMovieRedis: (request, result, next) => {
    redis.keys("getMovie:*", (error, result) => {
      if (result.length > 0) {
        // DELETE KEYS
        result.forEach((item) => {
          redis.DEL(item);
        });
      }
      next();
    });
  },

  getScheduleRedis: (request, response, next) => {
    redis.get(
      `getSchedule:${JSON.stringify(request.query)}`,
      (error, result) => {
        if (!error && result !== null) {
          console.log("Data dari Redis");
          const newResult = JSON.parse(result);
          return helperWraper.response(
            response,
            200,
            `Success Get Data`,
            newResult.result,
            newResult.pageInfo
          );
        } else {
          console.log("Data tidak ada di Redis");
          next();
        }
      }
    );
  },

  getScheduleByIdRedis: (request, response, next) => {
    const { id } = request.params;
    redis.get(`getSchedule:${id}`, (error, result) => {
      if (!error && result !== null) {
        console.log("Data dari Redis");
        const newResult = JSON.parse(result);
        return helperWraper.response(
          response,
          200,
          `Success Get Data`,
          newResult
        );
      } else {
        console.log("Data tidak ada di Redis");
        next();
      }
    });
  },

  getScheduleByMovieIdRedis: (request, response, next) => {
    const { id } = request.params;
    const { location, page } = request.query;
    redis.get(
      `getSchedule:MovieId${id}location${location}page${page}`,
      (error, result) => {
        if (!error && result !== null) {
          console.log("Data dari Redis");
          const newResult = JSON.parse(result);
          console.log("NewResult");
          console.log(newResult);
          return helperWraper.response(
            response,
            200,
            `Success Get Data`,
            newResult.result,
            newResult.pageInfo
          );
        } else {
          console.log("Data tidak ada di Redis");
          next();
        }
      }
    );
  },

  clearScheduleRedis: (request, result, next) => {
    redis.keys("getSchedule:*", (error, result) => {
      if (result.length > 0) {
        // DELETE KEYS
        result.forEach((item) => {
          redis.DEL(item);
        });
      }
      next();
    });
  },
};
