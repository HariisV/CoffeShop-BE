const { filter } = require("compression");
const helperWrapper = require("../../helper/wraper");
const dashboardModel = require("./dashboardModel");

module.exports = {
  getDashboard: async (req, res) => {
    try {
      const { filter } = req.params;
      // SELECT day(createdAt), SUM(totalPayment) As total FROM transaction_detail where WEEK(createdAt) = 47 GROUP BY DAY(createdAt);
      if (filter === "WEEK") {
        const allData = [];
        let thisDate = new Date();
        let curDate = new Date(
          `${thisDate.getFullYear()}-${
            thisDate.getMonth() + 1 > 10
              ? thisDate.getMonth() + 1
              : `0${thisDate.getMonth() + 1}`
          }-01`
        );
        for (let i = 1; i <= 4; i++) {
          let firstday = new Date(
            curDate.setDate(curDate.getDate() - curDate.getDay())
          );
          let lastday = new Date(
            curDate.setDate(curDate.getDate() - curDate.getDay() + 7)
          );
          firstday = `${firstday.getFullYear()}-${
            firstday.getMonth() + 1 < 10
              ? `0${firstday.getMonth() + 1}`
              : firstday.getMonth() + 1
          }-${
            firstday.getDate() > 10
              ? firstday.getDate()
              : `0${firstday.getDate()}`
          }`;

          lastday = `${lastday.getFullYear()}-${
            lastday.getMonth() + 1 < 10
              ? `0${lastday.getMonth() + 1}`
              : lastday.getMonth() + 1
          }-${
            lastday.getDate() > 10 ? lastday.getDate() : `0${lastday.getDate()}`
          }`;

          let result = await dashboardModel.getByWeek(firstday, lastday);
          console.log(result);
          allData.push({ name: `minggu-${i}`, total: result });
        }
        console.log(allData);
        return helperWrapper.response(
          res,
          200,
          `Success Get Dashboard By Week !`,
          allData
        );
      } else if (filter === "MONTH") {
        const allData = [];
        const listMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        listMonth.forEach(async (element) => {
          const result = await dashboardModel.getByMonth(element);
          return allData.push({ name: element, total: result });
        });
        setTimeout(() => {
          return helperWrapper.response(
            res,
            200,
            `Success Get Dashboard By Month !`,
            allData
          );
        }, 1000);
      } else if (filter === "DAY") {
        const date = new Date();
        function daysInMonth(month, year) {
          return new Date(year, month, 0).getDate();
        }
        const thisMonthDay = daysInMonth(date.getMonth(), date.getFullYear());
        const listDay = [];

        for (let i = 1; i <= thisMonthDay; i++) {
          listDay.push(i);
        }
        const result = await dashboardModel.getByDay();

        listDay.find(function (item, index) {
          let ppp = result.find(({ DAY }) => DAY === item);
          if (!ppp) {
            result.push({
              DAY: item,
              total: 0,
            });
          }
        });
        result.sort(function (a, b) {
          return a.DAY - b.DAY;
        });
        return helperWrapper.response(
          res,
          200,
          `Success Get Dashboard By DAY !`,
          result
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
