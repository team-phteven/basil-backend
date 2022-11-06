const User = require("../models/userModel");
const Conversation = require("../models/conversationModel");
const jwt = require("jsonwebtoken");
const { findById } = require("../models/userModel");
const conversationModel = require("../models/conversationModel");

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const name = `${user.firstName} ${user.lastName}`;
        const token = createToken(user._id);
        res.status(200).json({ name, email, avatar: user.avatar, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signup = async (req, res) => {
    const { firstName, lastName, email, password, avatar } = req.body;
    try {
        const user = await User.signup(
            firstName,
            lastName,
            email,
            password,
            avatar
        );
        const name = `${user.firstName} ${user.lastName}`;
        const token = createToken(user._id);
        res.status(200).json({ name, email, avatar: user.avatar, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const addRequest = async (req, res) => {
    try {
        const { contactId } = req.body;
        const { _id } = req.user;
        const user = await User.addRequest(contactId, _id);
        res.status(200).json({ message: "success", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// adding a request with just bearer token and email
const addRequestByEmail = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        const contactId = req.user._id;
        const user = await User.addRequestByEmail(contactId, email);
        res.status(200).json({ message: "success", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const declineRequest = async (req, res) => {
    try {
        const { contactId } = req.body;
        const { _id } = req.user;
        const user = await User.declineRequest(contactId, _id);
        res.status(200).json({ message: "success", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const acceptRequest = async (req, res) => {
    try {
        // contactId is the user we're accepting
        const { contactId } = req.body;
        // _id is the id of the person who's accepting the request
        const { _id } = req.user;
        const { isGroupConversation } = req.body;

        // create a new conversation between the accepting user and the requesting user
        const newConversation = await Conversation.new(
            _id,
            [contactId],
            isGroupConversation
        );

        const user = await User.declineRequest(contactId, _id);
        console.log(newConversation, user);
        res.status(200).json({ _id });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
};

const getRequests = async (req, res) => {
    try {
        const { _id } = req.user;
        const currentUser = await User.findById(_id).populate(
            "requests",
            "-password"
        );
        res.json(currentUser.requests);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const testAuth = async (req, res) => {
    res.status(200).json({
        message: "Authorization success",
        user_email: req.user.email,
    });
};

module.exports = {
    login,
    signup,
    addRequest,
    declineRequest,
    testAuth,
    addRequestByEmail,
    getRequests,
    acceptRequest,
};
