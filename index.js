const express = require("express");
const app = express();
const env = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http").createServer(app);
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { handleMessageRead } = require("./socketEventHandlers/messageRead");
const { handleSendMessage } = require("./socketEventHandlers/sendMessage.js");
const {
  handleMessageDelivered,
} = require("./socketEventHandlers/messageDelivered");

const { verify } = require("./middleware/verify");

app.use(express.static("/public"));
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

const corsOptions = {
  origin: [process.env.CLIENT_URL, "http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  handlePreFlightRequest: (req, res) => {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": [
        process.env.CLIENT_URL,
        "http://localhost:3000",
      ],
      // "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": '["GET", "POST", "PUT","DELETE"]',
    });
  },
};
app.use(cors(corsOptions));

const socket = require("socket.io")(http, {
  cors: {
    origin: [process.env.CLIENT_URL, "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],

    handlePreFlightRequest: (req, res) => {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": [
          process.env.CLIENT_URL,
          "http://localhost:3000",
        ],
        "Access-Control-Allow-Methods": '["GET", "POST", "PUT","DELETE"]',
      });
    },
  },
});

// ROUTES
const authRouter = require("./routers/authRouter");
const contactRouter = require("./routers/contactRouter");
const chatRouter = require("./routers/chatRouter");
const userRouter = require("./routers/userRouter");
const User = require("./models/User");
const Chat = require("./models/Chat");
const Message = require("./models/Message");

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
    handleSendMessage(socket, io, data, userIdSocketIdMap);
  });
  io.on("message-read", (data) => {
    handleMessageRead(socket, data, io, userIdSocketIdMap);
  });
  io.on("message-delivered", (data) => {
    handleMessageDelivered(socket, data, userIdSocketIdMap);
  });
  io.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

app.use("/auth", authRouter);
app.use("/contacts", verify, contactRouter);
app.use("/chats", verify, chatRouter);
app.use("/users", verify, userRouter);
app.use("/thumbnails/:path", (req, res) =>
  res.sendFile(__dirname + "/public/thumbnails/" + req.params.path)
);
app.use("/images/:path", (req, res) =>
  res.sendFile(__dirname + "/public/images/" + req.params.path)
);
// for assistance during development
app.get("/test", verify, (req, res) => {
  console.log("adad");
  return res.json({ text: "You are a God of programming" });
});
// for assistance during development
function showUsers(req, res) {
  User.find().then((users) => console.log(users));
}
function showChats() {
  Chat.find().then((chat) => console.log(chat));
}
function deleteChats() {
  Chat.deleteMany().then((resp) => console.log(resp.deletedCount));
  Message.deleteMany().then((resp) => console.log(resp.deletedCount));
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

//showUsers();
//showChats();
//deleteChats();

http.listen(process.env.PORT || 8000);
