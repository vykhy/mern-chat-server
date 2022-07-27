const Chat = require("../models/Chat");
const Message = require("../models/Message");
const mongoose = require("mongoose");

exports.createChat = async (req, res) => {
  console.log(req.body);
  let { userId1, userId2 } = req.body;

  try {
    const chat = await Chat.create({
      users: [
        mongoose.Types.ObjectId(userId1),
        mongoose.Types.ObjectId(userId2),
      ],
    });
    const newChat = await Chat.findOne({ _id: chat._id }).populate(
      "users",
      "-chats -contacts -password"
    );
    return res.json(newChat);
  } catch (err) {
    console.log(err);
    return new Error(err);
  }
};

exports.getChats = async (req, res) => {
  if (!req.userId) return res.sendStatus(400);
  let id = req.userId;
  if (typeof id === "string") id = mongoose.Types.ObjectId(id);
  try {
    let chats = await Chat.find(
      {
         users: id ,
      },
      "-createdAt -updatedAt"
    ).populate("users", "-chats -contacts -password");
    const chatsWithMessages = await Promise.all(
      chats.map(async (chat) => {
        const messages = await Message.find({ chatId: chat._id });
        return {
          _id: chat._id,
          users: chat.users,
          messages,
        };
      })
    );
    // console.log(chatsWithMessages);
    return res.json({ chats: chatsWithMessages });
  } catch (err) {
    console.log(err);
  }
};
