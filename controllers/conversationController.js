const Conversation = require("../models/conversationModel");
// const User = require("../models/userModel");

const createConversation = async (req, res) => {
    const { users, isGroupConversation } = req.body;

    const conversationData = {
        isGroupConversation: isGroupConversation,
        users: users,
    };

    try {
        const newConversation = await Conversation.create(conversationData);
        res.status(200).json(newConversation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createConversation,
};
