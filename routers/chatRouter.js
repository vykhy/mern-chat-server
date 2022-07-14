const router = require('express').Router()
const chatController = require('../controllers/chatController')

router.get('/', chatController.getChats)

module.exports = router