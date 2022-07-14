const Chat = require("../models/Chat");
const Message = require("../models/Message");
const mongoose = require("mongoose");

exports.createChat = async (userId1, userId2) => {
  let id1 = userId1;
  let id2 = userId2;
  try {
    if (typeof id1 === "string") id1 = mongoose.Types.ObjectId(id1);
    if (typeof id2 === "string") id2 = mongoose.Types.ObjectId(id2);
    const chat = await Chat.create({
      users: [id1, id2],
    });
    return chat._id;
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
        $in: { users: id },
      },
      "-createdAt -updatedAt"
    );
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
