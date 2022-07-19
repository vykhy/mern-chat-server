const router = require("express").Router();
const chatController = require("../controllers/chatController");

router.get("/", chatController.getChats);
router.post("/create", chatController.createChat);

module.exports = router;
