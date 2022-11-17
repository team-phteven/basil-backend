const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");

const createConversation = async (req, res) => {
    // here users is the array of users sent with the request.
    // the incoming array doesn't include the local user sending the request
    const { users } = req.body;
    const localId = req.user._id;
    const isGroupConversation = users.length > 1;
    let requests = [];

    // If not a group conversation remove conversation request from contact.
    if (!isGroupConversation) {
        const acceptedId = users[0];
        requests = await User.removeRequest(acceptedId, localId);
        User.addContact(users[0], localId);
        User.addContact(localId, users[0]);
    }

    // add logged in user to users
    users.push(localId);

    try {
        const newConversation = await Conversation.new(
            users,
            isGroupConversation
        );
        console.log(newConversation);
        res.status(200).json(requests);
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
            .sort({ "latestMessage.createdAt": 1 });

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
    ).populate("users", "-password").populate("groupAdmin", "-password");

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

const addSeconds = async (req, res) => {
    const { conversationId, seconds } = req.body;
    const userId = req.user._id;

    const updatedConversation = await Conversation.addSeconds(
        conversationId,
        userId,
        seconds
    );

    if (!updatedConversation) {
        res.status(404);
        throw new Error("Conversation Not Found");
    } else {
        res.json(updatedConversation);
    }
};

const addUsersToConvo = async (req, res) => {
    // here users is the array of users sent with the request.
    // the incoming array doesn't include the local user sending the request
    const { conversationId, users } = req.body;
    console.log("addUsersToConvo controller hit====>");
    console.log("conversationId:  " + conversationId);
    console.log("users: " + users);

    try {
        const updatedConversation = await Conversation.addUsersToConvo(
            conversationId,
            users
        );
        console.log(updatedConversation);
        res.status(200).json(updatedConversation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createConversation,
    getConversations,
    renameGroupConversation,
    addToGroupConversation,
    removeFromGroupConversation,
    addSeconds,
    addUsersToConvo,
};
