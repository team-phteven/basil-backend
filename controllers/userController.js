const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

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
        res.status(404).json({ error: error.message });
    }
};

const signup = async (req, res) => {
    const { firstName, lastName, email, password, avatar } = req.body;
    try {
        // use the signup User static method to create a new user with the parameters passed in with the request
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
        const { email } = req.body;
        const localId = req.user._id;
        // use User static method to add the local user's id to the other user's list of requests
        const user = await User.addRequestByEmail(localId, email);
        res.status(200).json({ message: "success", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// get user's incoming requests
const getRequests = async (req, res) => {
    try {
        const { _id } = req.user;
        // find the users in the current user's requests array
        const currentUser = await User.findById(_id).populate(
            "requests",
            "-password"
        );
        res.json(currentUser.requests);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const declineRequest = async (req, res) => {
    try {
        const { contactId } = req.body;
        const { _id } = req.user;
        // use User static method to remove the requesting user's id from the declining user's requests array
        const user = await User.removeRequest(contactId, _id);
        res.status(200).json({ message: "success", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateDetails = async (req, res) => {
    try {
        const { _id } = req.user;
        const { firstName, lastName, email } = req.body;
        // use User static method to update user's details with details passed in from request
        const user = await User.updateDetails({
            _id,
            firstName,
            lastName,
            email,
        });
        const name = `${user.firstName} ${user.lastName}`;
        const token = createToken(user._id);
        res.status(200).json({
            name,
            email: user.email,
            avatar: user.avatar,
            token,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateAvatar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { avatar } = req.body;
        // use User static method to update user's avatar with avatar passed in from request
        const user = await User.updateAvatar({
            _id,
            avatar,
        });
        const name = `${user.firstName} ${user.lastName}`;
        const token = createToken(user._id);
        res.status(200).json({
            name,
            email: user.email,
            avatar: user.avatar,
            token,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteAvatar = async (req, res) => {
    try {
        const { _id } = req.user;
        // use User static method to delete user's avatar
        const user = await User.deleteAvatar({
            _id,
        });
        const name = `${user.firstName} ${user.lastName}`;
        const token = createToken(user._id);
        res.status(200).json({
            name,
            email: user.email,
            avatar: user.avatar,
            token,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { _id } = req.user;
        const { oldPassword, newPassword } = req.body;
        // use User static method to delete user's avatar
        const user = await User.updatePassword({
            _id,
            oldPassword,
            newPassword,
        });
        res.status(200).json({ message: "success" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getContacts = async (req, res) => {
    try {
        const { _id } = req.user;
        // use User static method to retrieve a user's contacts
        const user = await User.getContacts({ _id });
        res.status(200).json({ contacts: user.contacts });
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
    getRequests,
    addRequest,
    declineRequest,
    updateDetails,
    updatePassword,
    updateAvatar,
    deleteAvatar,
    testAuth,
    getContacts,
};
