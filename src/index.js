const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const routeNavigation = require("./routes");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public")); // localhost:3001/public/upload/movie/nama_gambar
app.use(morgan("dev"));
app.use(cors());
app.options("*", cors());
app.use(xss());
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", routeNavigation);
app.use("/*", (request, response) => {
	response.status(404).send("Path not found !");
});

app.listen(port, () => {
	console.log(`Express app is linsten on port ${port}!`);
});
