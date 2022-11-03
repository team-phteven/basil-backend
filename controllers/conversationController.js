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

        const populatedResults = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
        });
        res.status(200).send(populatedResults);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

const renameGroupConversation = async (req, res) => {
    const { conversationId, conversationName } = req.body;

    const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
            conversationName: conversationName,
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedConversation) {
        res.status(404);
        throw new Error("conversation Not Found");
    } else {
        res.json(updatedConversation);
    }
};

const addToGroupConversation = async (req, res) => {
    const { conversationId, contactId } = req.body;

    const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
            $push: { users: contactId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedConversation) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedConversation);
    }
};

const removeFromGroupConversation = async (req, res) => {
    const { conversationId, contactId } = req.body;

    const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
            $pull: { users: contactId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedConversation) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedConversation);
    }
};

module.exports = {
    createConversation,
    getConversations,
    renameGroupConversation,
    addToGroupConversation,
    removeFromGroupConversation,
};
