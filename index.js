const app = require("express")();
const env = require("dotenv");
const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const { verify } = require("./middleware/verify");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//parse cookies
app.use(cookieParser());

//CONSTANTS
env.config();
const PORT = process.env.APP_PORT;

// DB connection
mongoose.connect(process.env.DB_URL, () => console.log("db connected..."));

// ROUTES
const authRouter = require("./routers/authRouter");
app.use("/auth", authRouter);
// app.use(verify);
app.get("/test", verify, (req, res) => {
  console.log("adad");
  return res.json({ text: "You are a God of programming" });
});

app.listen(8000);
