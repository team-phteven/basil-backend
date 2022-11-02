const Conversation = require("../models/conversationModel");
// const User = require("../models/userModel");

const createConversation = async (req, res) => {
    const { title, load, reps } = req.body;

    // add doc to db
    try {
        const user_id = req.user._id;
        const workout = await Workout.create({ title, load, reps, user_id });
        res.status(200).json(workout);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createConversation,
};
