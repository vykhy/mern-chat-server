/**
 * contains routes dealing with user authentication
 */
const router = require("express").Router();
const authController = require("../controllers/authController");
const { verify } = require("../middleware/verify");

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.get("/refresh", authController.refreshToken);

router.get("/verify", verify, (req, res) => res.sendStatus(200));

module.exports = router;
