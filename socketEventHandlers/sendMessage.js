const { createMessage } = require("../controllers/messageController");
const { createChat } = require("../controllers/chatController");
const { getUserIdBySocketId } = require("../functions/getUserIdBySocketId");
const User = require("../models/User");
const Chat = require("../models/Chat");
const mongoose = require("mongoose");

/**
 * this function handles when a user sends a new message
 */
exports.handleSendMessage = async (io, data, userIdSocketIdMap) => {
  console.log(data);
  let chatId = data.chatId;
  let newChat = false;
  // if no chatId, create new chat and return it too
  if (!data.chatId) {
    newChat = true;
    chatId = await createChat(
      getUserIdBySocketId(userIdSocketIdMap, io.id),
      data.recipientId
    );
  }
  // save message to database
  const message = await createMessage(chatId, data.authorId, data.message);
  // emit message to recipient
  if (!newChat) {
    io.to(userIdSocketIdMap[data.recipientId]).emit("new-message", {
      data: message,
    });
    // emit to sender that server recieved message
    io.emit("message-sent", message);
  } else {
    try {
      const user = await User.findOne({
        _id: mongoose.Types.ObjectId(
          getUserIdBySocketId(userIdSocketIdMap, io.id)
        ),
      });
      const chat = await Chat.findOne({ _id: chatId });
      io.to(userIdSocketIdMap[data.recipientId]).emit("new-message", {
        message: message,
        user: user,
        chat,
      });
      // emit to sender that server recieved message
      io.emit("message-sent", { message, chat });
    } catch (err) {
      console.log(err);
    }
  }
};
