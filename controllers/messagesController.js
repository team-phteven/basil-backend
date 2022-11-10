const mongoose = require("mongoose");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Conversation = require("../models/conversationModel");

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversation: req.params.conversationId,
        })
            .sort({ createdAt: -1 })
            .populate("sender", "firstName avatar lastName")
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
        console.log("Missing content or conversation");
        return res.sendStatus(400);
    }

    let messageData = {
        sender: req.user._id,
        content: content,
        conversation: conversationId,
    };

    try {
        let message = await Message.create(messageData);

        message = await message.populate("sender", "firstName avatar");
        // message = await message.populate("conversation", "users");
        message = await message.populate({
            path: "conversation",
            populate: { path: "users" },
        });

        let updatedConversation = await Conversation.addLatestMessage(
            conversationId,
            message._id
        );

        res.json(message);
        console.log(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

module.exports = {
    getMessages,
    sendMessage,
};
