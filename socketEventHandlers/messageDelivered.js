const { markAsDelivered } = require("../controllers/messageController");

exports.handleMessageDelivered = async (socket, data, userIdSocketIdMap) => {
  const time = !data.time ? data.delivered : data.time;
  // update message in database as delivered
  const message = await markAsDelivered(data._id, time);
  // emit to author of message that it was delivered
  try {
    socket.to(userIdSocketIdMap[data.authorId]).emit("marked-as-delivered", {
      chatId: data.chatId,
      messageId: data._id,
      time: time,
    });
  } catch (err) {
    console.log(err);
  }
};
