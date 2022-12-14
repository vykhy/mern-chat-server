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
    console.log(err);
    return res.sendStatus(500);
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.userId;
  const { firstName, lastName, about } = req.body;
  if (firstName === "" || lastName === "null") {
    return res.status(200).json({ message: "name cannot be empty" });
  }
  try {
    const user = await User.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(userId),
      },
      {
        firstName: firstName,
        lastName: lastName,
        about: about,
      },
      { new: true }
    );
    return res.json(user);
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
        thumbnail: `${fullUrl}/thumbnails/${req.fileName}`,
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
