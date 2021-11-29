const { filter } = require("compression");
const helperWrapper = require("../../helper/wraper");
const dashboardModel = require("./dashboardModel");
const path = require("path");
const ejs = require("ejs");
const htmlPdf = require("html-pdf");

module.exports = {
	getDashboard: async (req, res) => {
		try {
			const { filter } = req.params;
			const fileName = `report-dashboard-${filter}.pdf`;
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
					allData.push({
						name: `minggu-${i}`,
						total: new Intl.NumberFormat("id-ID").format(result),
					});
				}

				// GENERATE PDF
				ejs.renderFile(
					path.join(__dirname, "../../template/generate", "transaction.ejs"),
					{ allData: allData, filter: filter },
					(error, results) => {
						if (!error) {
							let options = {
								height: "11.25in",
								width: "10.5in",
							};
							htmlPdf
								.create(results, options)
								.toFile(
									path.resolve(`./public/upload/generate/${fileName}`),
									(error, results) => {
										if (error) {
											return helperWrapper.response(
												res,
												400,
												error.message,
												null
											);
										} else {
											console.log("hasil data =>", { allData, filter });

											return helperWrapper.response(
												res,
												200,
												"Success Get Dashboard By Week.",
												{
													allData,
													redirect_url: `http://localhost:3001/upload/generate/${fileName}`,
												}
											);
										}
									}
								);
						}
					}
				);
			} else if (filter === "MONTH") {
				const allData = [];
				const listMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
				listMonth.forEach(async (element) => {
					const result = await dashboardModel.getByMonth(element);
					return allData.push({ name: element, total: result });
				});

				setTimeout(() => {
					ejs.renderFile(
						path.join(__dirname, "../../template/generate", "transaction.ejs"),
						{ allData, filter: filter },
						(error, results) => {
							if (!error) {
								let options = {
									height: "11.25in",
									width: "10.5in",
								};
								htmlPdf
									.create(results, options)
									.toFile(
										path.resolve(`./public/upload/generate/${fileName}`),
										(error, results) => {
											if (error) {
												return helperWrapper.response(
													res,
													400,
													error.message,
													null
												);
											} else {
												console.log("data bulan =>", allData);
												return helperWrapper.response(
													res,
													200,
													"Success Get Dashboard By Month.",
													{
														allData,
														redirect_url: `http://localhost:3001/upload/generate/${fileName}`,
													}
												);
											}
										}
									);
							}
						}
					);
				}, 1500);
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

				ejs.renderFile(
					path.join(__dirname, "../../template/generate", "transaction.ejs"),
					{ allData: result, filter: filter },
					(error, results) => {
						if (!error) {
							let options = {
								height: "11.25in",
								width: "10.5in",
							};
							htmlPdf
								.create(results, options)
								.toFile(
									path.resolve(`./public/upload/generate/${fileName}`),
									(error, results) => {
										if (error) {
											return helperWrapper.response(
												res,
												400,
												error.message,
												null
											);
										} else {
											return helperWrapper.response(
												res,
												200,
												"Success Get Dashboard By Day.",
												{
													result,
													redirect_url: `http://localhost:3001/upload/generate/${fileName}`,
												}
											);
										}
									}
								);
						}
					}
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
