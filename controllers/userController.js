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
        res.status(400).json({ error: error.message + bruh });
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
        const { contactId } = req.body;
        const { _id } = req.user;
        const user = await User.declineRequest(contactId, _id);
        res.status(200).json({ message: "success", user });
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

module.exports = { login, signup, addRequest, declineRequest, testAuth };
