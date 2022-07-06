/**
 * contains routes dealing with user authentication
 */
const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.get("/refresh", authController.refreshToken);

module.exports = router;
