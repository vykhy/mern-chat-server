const { createMessage } = require("../controllers/messageController");
const Chat = require("../models/Chat");
const mongoose = require("mongoose");

/**
 * this function handles when a user sends a new message
 */
exports.handleSendMessage = async (socket, io, data, userIdSocketIdMap) => {
  let chatId = data.chatId;
  // save message to database
  const message = await createMessage(chatId, data.authorId, data.message);
  // if its a new chat, we send chat data too to the recipient
  if (data.newChat === true) {
    let chat = await Chat.findOne({
      _id: mongoose.Types.ObjectId(chatId),
    }).populate("users", "-contacts -chats -password");

    socket
      .to(userIdSocketIdMap[data.recipientId])
      .emit("new-chat-message", { message, chat });
  } else {
    // emit message to recipient
    socket.to(userIdSocketIdMap[data.recipientId]).emit("new-message", message);
  }

  // emit to sender that server recieved message
  io.emit("message-sent", message);
};
