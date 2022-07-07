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
const contactRouter = require("./routers/contactRouter");

app.use("/auth", authRouter);
app.use("/contacts", verify, contactRouter);
app.get("/test", verify, (req, res) => {
  console.log("adad");
  return res.json({ text: "You are a God of programming" });
});
app.get("/users/all", async (req, res) => {
  const User = require("./models/User");
  console.log(await User.find());
  res.send("dodne");
});

app.listen(8000);
