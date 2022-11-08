const mongoose = require("mongoose");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Conversation = require("../models/conversationModel");

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.body.conversationId })
            .populate("sender", "name pic email")
            .populate("conversation");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

const sendMessage = async (req, res) => {
    const { content, conversationId } = req.body;

    if (!content || !conversationId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    let messageData = {
        sender: req.user._id,
        content: content,
        conversation: conversationId,
    };

    try {
        let newMessage = await Message.create(messageData);

        newMessage = await message
            .populate("sender", "name pic")
            .execPopulate();
        newMessage = await message.populate("conversation").execPopulate();
        newMessage = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Conversation.findByIdAndUpdate(req.body.conversationId, {
            latestMessage: message,
        });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

module.exports = {
    getMessages,
    sendMessage,
};
