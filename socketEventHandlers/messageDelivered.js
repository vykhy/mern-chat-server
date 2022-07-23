const { markAsDelivered } = require("../controllers/messageController");

exports.handleMessageDelivered = async (socket, data, userIdSocketIdMap) => {
  // update message in database as delivered
  const message = await markAsDelivered(data._id, data.time);
  // emit to author of message that it was delivered
  try {
    socket.to(userIdSocketIdMap[data.authorId]).emit("marked-as-delivered", {
      chatId: data.chatId,
      messageId: data._id,
      time: data.time,
    });
  } catch (err) {
    console.log(err);
  }
};
