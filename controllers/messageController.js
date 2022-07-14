const Message = require('../models/Message')
const mongoose = require('mongoose')

exports.createMessage = async (chatId, authorId, message) => {
    try{
        const newMessage = await Message.create({
            chatId: mongoose.Types.ObjectId(chatId),
            authorId: mongoose.Types.ObjectId(authorId),
            message: message
        })
        return newMessage
    }
    catch(err){
        console.log(err)
        return err
    }
}