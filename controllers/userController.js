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
    console.log(req.body.email);
    try {
        const { email } = req.body;
        const localId = req.user._id;
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
        const user = await User.removeRequest(contactId, _id);
        res.status(200).json({ message: "success", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateDetails = async (req, res) => {
    try {
        const { _id } = req.user;
        const {
            firstName,
            lastName,
            email
        } = req.body;
        const user = await User.updateDetails({_id, firstName, lastName, email});
        const name = `${user.firstName} ${user.lastName}`;
        const token = createToken(user._id);
        res.status(200).json({ name, email: user.email, avatar: user.avatar, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateAvatar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { avatar } = req.body;
        const user = await User.updateAvatar({
            _id,
            avatar
        });
        const name = `${user.firstName} ${user.lastName}`;
        const token = createToken(user._id);
        res.status(200).json({ name, email: user.email, avatar: user.avatar, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteAvatar = async (req, res) => {
    try {
        const { _id } = req.user;
        const user = await User.deleteAvatar({
            _id,
        });
        const name = `${user.firstName} ${user.lastName}`;
        const token = createToken(user._id);
        res.status(200).json({ name, email: user.email, avatar: user.avatar, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { _id } = req.user;
        const { oldPassword, newPassword } = req.body;
        const user = await User.updatePassword({
            _id,
            oldPassword,
            newPassword
        });
        res.status(200).json({ message: "success" });
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
    testAuth
};
