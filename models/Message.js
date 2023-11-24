const mongoose = require("mongoose");

const Message = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.ObjectId,
      ref: "Chat",
    },
    authorId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
    },
    delivered: {
      type: Date,
      default: null,
    },
    read: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", Message);
