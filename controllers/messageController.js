const Message = require("../models/Message");
const mongoose = require("mongoose");

exports.createMessage = async (chatId, authorId, message) => {
  try {
    const newMessage = await Message.create({
      chatId: mongoose.Types.ObjectId(chatId),
      authorId: mongoose.Types.ObjectId(authorId),
      message: message,
    });
    return newMessage;
  } catch (err) {
    console.log(err);
    return err;
  }
};

exports.markAsRead = async (messageId, time) => {
  try {
    const message = await Message.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(messageId),
        read: null,
      },
      {
        read: time,
      },
      { new: true }
    );
    return message;
  } catch (err) {
    console.log(err);
    return err;
  }
};

exports.markAsDelivered = async (messageId, time) => {
  try {
    const message = await Message.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(messageId),
        delivered: null,
      },
      {
        delivered: time,
      },
      { new: true }
    );
    return message;
  } catch (err) {
    console.log(err);
    return err;
  }
};
