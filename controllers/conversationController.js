const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

const createConversation = async (req, res) => {
    // here users is the array of users sent with the request.
    // the incoming array doesn't include the local user sending the request
    const { users, groupName } = req.body;
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

    // Use Conversation static method to create new Conversation document, passing in parameters destructured from the request
    try {
        const newConversation = await Conversation.new(
            users,
            isGroupConversation,
            groupName
        );
        res.status(200).json(requests);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getConversations = async (req, res) => {
    try {
        // find Conversations for a specific user by retrieving all Conversations where their User ref property matches the id of the User passed in with the request
        const results = await Conversation.find({
            users: { $elemMatch: { $eq: req.user._id } },
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ "latestMessage.createdAt": 1 });

        // Populate the returned conversations' latestMessage.sender property with their details
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
    const { conversationId, groupName } = req.body;

    // Find a conversation by id passed in with request
    // Update the groupName property of that conversation with the groupName passed in with the request
    const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
            groupName: groupName,
        },
        {
            new: true,
        }
    )
        // populate the users array of the found conversations with the users' details
        .populate("users", "-password");

    if (!updatedConversation) {
        res.status(404);
        throw new Error("conversation Not Found");
    } else {
        res.json(updatedConversation);
    }
};

const addToGroupConversation = async (req, res) => {
    const { conversationId, contactId } = req.body;

    // find a conversation by id passed in to request, add the passed in user id to the conversation's list of users
    const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
            $push: { users: contactId },
        },
        {
            new: true,
        }
    ).populate("users", "-password");

    if (!updatedConversation) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedConversation);
    }
};

const removeFromGroupConversation = async (req, res) => {
    const { conversationId } = req.body;
    const { _id } = req.user;

    // find conversation by id passed in with request and remove the requesting user's id from the conversation's list of users
    const updatedConversation = await Conversation.findByIdAndUpdate(
        mongoose.Types.ObjectId(conversationId),
        {
            $pull: { users: mongoose.Types.ObjectId(_id) },
        },
        {
            new: true,
        }
    ).populate("users", "-password");

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

    // Use Conversation static method to increment the seconds property for a specific user in a conversation
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

    try {
        // uses Conversation static method to add a list of user ids to a conversation's list of users
        const updatedConversation = await Conversation.addUsersToConvo(
            conversationId,
            users
        );
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
