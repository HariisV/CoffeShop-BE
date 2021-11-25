const helperWrapper = require("../../helper/wraper");
const dashboardModel = require("./dashboardModel");

module.exports = {
  getDashboard: async (req, res) => {
    try {
      const { filter } = req.params;
      if (filter === "WEEK" || filter === "DAY" || filter === "MONTH") {
        const result = await dashboardModel.getDashboard(filter);
        console.log(result[0].total);
        return helperWrapper.response(
          res,
          200,
          `Success Get Dashboard !`,
          result[0].total
        );
      } else {
        return helperWrapper.response(
          res,
          400,
          `Wrong Filter, Only DAY | WEEK | MONTH`,
          null
        );
      }
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
