const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: "5m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_KEY);
};

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
  const { email, password } = req.body;

  let error = null;
  // validate password and user from db

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(400)
      .json({ message: "User with this email does not exist" });
  //Check whether password is correct
  try {
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        //Generate an access token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        // refreshTokens.push(refreshToken);
        return res.json({
          userId: user._id,
          userName: `${user.firstName} ${user.lastName}`,
          accessToken,
          refreshToken,
        });
      } else if (err) {
        return res.status(400).json("Username or password incorrect!");
      }
    });
  } catch (error) {
    return res.status(200).json({ error: "Failed to log in" });
  }
};
