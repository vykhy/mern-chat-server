const User = require("../models/User");
const mongoose = require("mongoose");

/**
 * fetches all the contacts of a user
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getContacts = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findOne({
      _id: userId,
    }).populate("contacts.contactId", "-chats -contacts -password");
    return res.json({ contacts: user.contacts });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

/**
 * fetch a contact by id
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getContactById = async (req, res) => {
  const userId = req.userId;
  const contactId = req.params.id;
  try {
    const user = await User.findOne({
      _id: userId,
    }).populate("contacts.contactId", "-chats -contacts -password");

    const contact =
      user.contacts.find(
        (contact) =>
          mongoose.Types.ObjectId(contact.contactId._id).valueOf() == contactId
      ) || null;
    return res.json(contact);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

/**
 * handles adding a new contact to a user
 * @param {} req
 * @param {*} res
 * @returns
 */
exports.addContact = async (req, res) => {
  // get form values
  const { name, email } = req.body;
  const userId = req.userId;
  let userToAdd;
  let error = null;
  if (name === "" || name === undefined || name === null) {
    error = "Name cannot be empty";
  } else {
    userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      error = "User with this email does not exist";
    }
  }
  if (error !== null) {
    return res.status(200).json({ error });
  }
  // insert into database
  try {
    const contact = {
      name: name,
      contactId: userToAdd._id,
    };
    const user = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      {
        $addToSet: { contacts: contact },
      },
      { new: true }
    );
    // console.log(user);
    // console.log(contact);
    return res.status(200).json({
      contactId: userToAdd._id,
      contactName: name,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

exports.removeContact = async (req, res) => {
  // find contact and remove from database
};
