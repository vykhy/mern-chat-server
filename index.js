const app = require("express")();
const env = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http").createServer(app);
const cookieParser = require("cookie-parser");
const cors = require("cors");

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

app.use(cors());
const socket = require("socket.io")(http, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE"],

    handlePreFlightRequest: (req, res) => {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": process.env.CLIENT_URL,
        "Access-Control-Allow-Methods": '["GET", "POST", "DELETE"]',
      });
    },
  },
});

// ROUTES
const authRouter = require("./routers/authRouter");
const contactRouter = require("./routers/contactRouter");
const User = require("./models/User");

socket.on("connection", (socket) => {
  console.log("socket connected...");

  socket.on("yes", () => {
    socket.emit("working", { response: "event received" });
  });
  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

app.use("/auth", authRouter);
app.use("/contacts", verify, contactRouter);
app.get("/test", verify, (req, res) => {
  console.log("adad");
  return res.json({ text: "You are a God of programming" });
});
app.get("/users/all", async (req, res) => {
  console.log(await User.find());
  res.send("dodne");
});
app.get("/deletecontacts", verify, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    {
      _id: mongoose.Types.ObjectId(req.userId),
    },
    {
      contacts: [],
    }
  );
  res.send("dodne");
});

http.listen(process.env.PORT || 8000);
