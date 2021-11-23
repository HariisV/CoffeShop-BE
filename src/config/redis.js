const redis = require("redis");
require("dotenv").config

const client = redis.createClient({
  host : process.env.redis_hostname,
  port : process.env.redis_port,
  password : process.env.redis_password
});

client.on("connect", () => {
  console.log("You're now connected to redis ...");
});

module.exports = client;
