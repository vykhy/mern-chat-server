const mongoose = require("mongoose");

const Contact = new mongoose.Schema(
  {
    name: {
      type: String,
      max: 30,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", Contact);
