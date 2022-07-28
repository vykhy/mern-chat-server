const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { FileHandler } = require("../classes/FileHandler");

const generateAccessToken = (id) => {
  return jwt.sign({ id: id }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (id) => {
  console.log("new refresh token");
  return jwt.sign({ id: id }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: "3d",
  });
};

exports.refreshToken = async (req, res) => {
  const token = req.cookies.jwt;
  // force login if no refresh token found
  if (!token) return res.sendStatus(401);

  // verify refresh token
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);

    // get user with their respective refresh tokens from storage
    let fileHandler = new FileHandler();
    let user = fileHandler.getRefreshToken(decoded.id);

    // if no refresh token found for user, force login
    if (!user) return res.sendStatus(401);

    //generate and return new access token
    const accessToken = generateAccessToken(decoded.id);
    return res.json({ accessToken });
  } catch (err) {
    // token is expired or tampered, so remove it from tokens list
    let fileHandler = new FileHandler();
    fileHandler.removeRefreshTokenByToken(token);
    res.clearCookie(jwt, { httpOnly: true, secure: false, sameSite: "None" });
    return res.sendStatus(500);
  }
  // update refresh token
};
exports.signup = async (req, res) => {
  //get values from request
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  // VALIDATE INPUT
  let error = null;
  // check if empty values
  if (firstName == "" || lastName === "" || email == "" || password == "") {
    error = "All fields are required";
  }
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
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // save token to file
        const fileHandler = new FileHandler();
        fileHandler.setRefreshToken(user._id, refreshToken);

        // set refresh token in secure cookie
        res.cookie("jwt", refreshToken, {
          secure: true,
          httpOnly: true,
          sameSite: "None",
          maxAge: 24 * 3600 * 1000,
        });

        // respond with data
        return res.json({
          userId: user._id,
          userName: `${user.firstName} ${user.lastName}`,
          thumbnail: user.thumbnail,
          profilePicture: user.profilePicture,
          accessToken,
        });
      } else if (err) {
        return res.status(400).json("Username or password incorrect!");
      }
    });
  } catch (error) {
    return res.status(200).json({ error: "Failed to log in" });
  }
};
