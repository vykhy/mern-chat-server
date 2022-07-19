const { createMessage } = require("../controllers/messageController");
const { createChat } = require("../controllers/chatController");
const { getUserIdBySocketId } = require("../functions/getUserIdBySocketId");
const User = require("../models/User");
const Chat = require("../models/Chat");
const mongoose = require("mongoose");

/**
 * this function handles when a user sends a new message
 */
exports.handleSendMessage = async (socket, io, data, userIdSocketIdMap) => {
  console.log(data);
  let chatId = data.chatId;
  // save message to database
  const message = await createMessage(chatId, data.authorId, data.message);
  // emit message to recipient
  socket.to(userIdSocketIdMap[data.recipientId]).emit("new-message", message);
  // emit to sender that server recieved message
  io.emit("message-sent", message);
};
