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
    try {
        const results = await Conversation.find({
            users: { $elemMatch: { $eq: req.user._id } },
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });
        // .then(async (results) => {

        const populatedResults = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
        });
        res.status(200).send(populatedResults);
        // });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

module.exports = {
    createConversation,
    getConversations,
    //createGroupConversation,
    //renameGroup,
    //addToGroup,
    //removeFromGroup
};
