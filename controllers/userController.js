const User = require("../models/User");
const mongoose = require("mongoose");

const getUserDetails = async (userId) => {
  let id = userId;
  if (typeof userId === "string") id = mongoose.Types.ObjectId(userId);
  try {
    const user = await User.findById(id).select("-chats -contacts -password");
    return user;
  } catch (err) {
    console.log(err);
    return err;
  }
};

exports.getUser = async (req, res) => {
  try {
    return res.json(await getUserDetails(req.params.id));
  } catch (err) {
    return res.sendStatus(500);
  }
};
