const app = require("express")();
const env = require("dotenv");
const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//CONSTANTS
env.config();
const PORT = process.env.APP_PORT;

// DB connection
mongoose.connect(process.env.DB_URL, () => console.log("db connected..."));

// ROUTES
const authRouter = require("./routers/authRouter");
app.use("/auth", authRouter);

app.listen(8000);
