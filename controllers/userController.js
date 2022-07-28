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

exports.updateProfileImage = async (req, res) => {
  const { userId } = req;
  try {
    const fullUrl = req.protocol + "://" + req.get("host");
    const user = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      {
        profilePicture: `${fullUrl}/images/${req.fileName}`,
        thumbnail: `${fullUrl}/images/thumbnails/${req.fileName}`,
      },
      { new: true }
    );
    return res.json({
      id: user.id,
      name: user.firstName + " " + user.lastName,
      thumbnail: user.thumbnail,
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.removeProfileImage = async (req, res) => {
  const userId = req.userId;
  try {
    const response = await User.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(userId),
      },
      {
        thumbnail: null,
        profilePicture: null,
      }
    );
    return res.json({ removed: true });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
