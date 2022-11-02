const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");

const createConversation = async (req, res) => {
    const { usersArray, isGroup } = req.body;

    try {
        const newConversation = await Conversation.new(usersArray, isGroup);
        res.status(200).json(newConversation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getConversations = async (req, res) => {
    res.status(200).json({ mssg: "all conversations!" });
};

module.exports = {
    createConversation,
    getConversations,
};
