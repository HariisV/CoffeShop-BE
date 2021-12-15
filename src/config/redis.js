const redis = require("redis");
require("dotenv").config();

console.log("HAIIIIII", process.env.RDS_hostname);
const client = redis.createClient({
  host: process.env.RDS_hostname,
  port: process.env.RDS_port,
  password: process.env.RDS_password,
});

client.on("connect", () => {
  console.log("You're now connected to redis ...");
});

module.exports = client;
