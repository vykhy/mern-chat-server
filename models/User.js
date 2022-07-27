const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    firstName: {
      type: String,
      max: 30,
      required: true,
    },
    lastName: {
      type: String,
      max: 30,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    chats: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Chat",
      default: [],
    },
    contacts: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          contactId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        },
      ],
      default: [],
    },
    profilePicture: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "Hello. I am using chat app!",
    },
    lastSeen: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", User);
