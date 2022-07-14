const app = require("express")();
const env = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http").createServer(app);
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { verify } = require("./middleware/verify");
const { handleSendMessage } = require("./socketEventHandlers/sendMessage.js");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//parse cookies
app.use(cookieParser());

//CONSTANTS
env.config();
const PORT = process.env.APP_PORT;

const userIdSocketIdMap = {};

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
const chatRouter = require("./routers/chatRouter");
const User = require("./models/User");

// SOCKET MIDDLEWARE
socket.use((socket, next) => {
  if (socket.handshake && socket.handshake.query.userId) {
    userIdSocketIdMap[socket.handshake.query.userId] = socket.id;
  }
  next();
});
// SOCKET EVENTS
socket.on("connection", (io) => {
  console.log("socket connected...");

  io.on("send-message", (data) => {
    handleSendMessage(io, data, userIdSocketIdMap);

    io.emit("found", { response: "message received" });
  });
  io.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

app.use("/auth", authRouter);
app.use("/contacts", verify, contactRouter);
app.use("/chats", verify, chatRouter);
// for assistance during development
app.get("/test", verify, (req, res) => {
  console.log("adad");
  return res.json({ text: "You are a God of programming" });
});
// for assistance during development
function showUsers(req, res) {
  User.find().then((users) => console.log(users));
}
// for assistance during development
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

// showUsers();

http.listen(process.env.PORT || 8000);
