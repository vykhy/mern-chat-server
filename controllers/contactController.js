const Contact = require("../models/Contact");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.addContact = async (req, res) => {
  // get form values
  const { name, email } = req.body;
  const userId = req.headers.currentuser;
  let error = null;
  if (name === "" || name === undefined || name === null) {
    error = "Name cannot be empty";
  } else {
    const user = await User.findOne({ email });

    if (!user) {
      error = "User with this email does not exist";
    }
  }
  if (error !== null) {
    return res.status(200).json({ error });
  }
  // insert into database
  try {
    // prevent duplicate contact by searching for
    // a contact with the same owner and email as the new contact
    const exists = await Contact.findOne({
      owner: mongoose.Types.ObjectId(userId),
      email: email,
    });
    if (exists) {
      return res.json({ error: "You have already saved this contact" });
    }
    // create contact if doesnt already exist
    const contact = await Contact.create({
      name,
      owner: mongoose.Types.ObjectId(userId),
      email,
    });
    const user = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      {
        $push: { contacts: contact._id },
      },
      { new: true }
    );
    // console.log(user);
    // console.log(contact);
    return res
      .status(200)
      .json({
        contactId: contact._id,
        contactName: contact.name,
        contactEmail: contact.email,
      });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

exports.removeContact = async (req, res) => {
  // find contact and remove from database
};
