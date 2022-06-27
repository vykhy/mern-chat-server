const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  //get values from request
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  // VALIDATE INPUT
  let error = null;
  // check if empty values
  if (firstName == "" || lastName === "" || email == "" || password == "")
    error = "All fields are required";

  //check if user with email already exists
  const exists = await User.findOne({ email });
  if (exists) error = "User with this email already exists";

  //confirm password
  if (password !== confirmPassword) error = "Passwords do not match";

  //return if error
  if (error) {
    return res.status(200).json({ error });
  }
  //create user in database
  try {
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        throw err;
      } else {
        const user = await User.create({
          firstName,
          lastName,
          email,
          password: hash,
        });
        return res.status(201).json({ message: "User created successfully" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
  //log them in
};

exports.login = async (req, res) => {
  // get values from request
  console.log("called");
  const { email, password } = req.body;
  console.log(email, password, " from controller");
  res.json({ email, password });
  // validate password and user from db

  // create access and refresh tokens
};
