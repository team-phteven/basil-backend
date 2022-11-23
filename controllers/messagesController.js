const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");

const getMessages = async (req, res) => {
    try {
        // find all messages that have a conversation id matching the id passed in with the request
        const messages = await Message.find({
            conversation: req.params.conversationId,
        })
            .sort({ createdAt: -1 })
            // populate the details of the message's sender
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
        return res.sendStatus(400);
    }

    let messageData = {
        sender: req.user._id,
        content: content,
        conversation: conversationId,
    };

    try {
        // create a new message with the data passed in from the request
        let message = await Message.create(messageData);

        // populate refs of the message
        message = await message.populate("sender", "firstName avatar");
        message = await message.populate({
            path: "conversation",
            populate: { path: "users" },
        });

        // update the associated conversation with the newly created message as its latest message
        let updatedConversation = await Conversation.addLatestMessage(
            conversationId,
            message._id
        );

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
