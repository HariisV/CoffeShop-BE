/* eslint-disable no-unused-vars */
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
require("dotenv").config();

const sendMail = (data) =>
	new Promise((resolve, reject) => {
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false,
			auth: {
				user: process.env.gmail_email,
				pass: process.env.gmail_pass,
			},
		});

		transporter.use(
			"compile",
			hbs({
				viewEngine: {
					extname: ".html",
					partialsDir: path.resolve("./src/template/email"),
					defaultLayout: false,
				},
				viewPath: path.resolve("./src/template/email"),
				extName: ".html",
			})
		);

		let mailOption = {
			from: `"Panda Coffee Shop" <PandaCoffeeShop@gmail.com>`,
			to: data.to,
			subject: data.subject,
			template: data.template,
			context: data.data,
		};

		if (data.attachment) {
			mailOption.attachment = data.attachment;
		}

		transporter.sendMail(mailOption, (error, info) => {
			if (error) {
				reject(error);
			} else {
				resolve(info.response);
			}
		});
	});

module.exports = sendMail;
