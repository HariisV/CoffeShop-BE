const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport({
  service: "smtp.gmail.com",
  port:587,
  auth: {
    user: process.env.email,
    pass: process.env.pass,
  },
});

let mailOption = {
  from: "Ticketing App",
  to: "andreasckurniawan01@gmail.com",
  subject: "TEST",
  text: "HEllo",
};

transport.sendMail(mailOption, function (err, data) {
  if (!err) {
    console.log("Error");
  } else {
    console.log("Sent");
  }
});
