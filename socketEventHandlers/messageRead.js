const { markAsRead } = require("../controllers/messageController");

exports.handleMessageRead = async (socket, data, io, userIdSocketIdMap) => {
  // update message in database as read
  const message = await markAsRead(data._id, data.time);
  // emit to author and recipient of message that it was read
  try {
    socket.to(userIdSocketIdMap[data.authorId]).emit("marked-as-read", {
      chatId: data.chatId,
      messageId: data._id,
      time: data.time,
    });
    io.emit("marked-as-read", {
      chatId: data.chatId,
      messageId: data._id,
      time: data.time,
    });
  } catch (err) {
    console.log(err);
  }
};
