const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
    {
        conversationName: { type: String, trim: true },
        isGroupConversation: { type: Boolean, default: false },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

conversationSchema.statics.new = async function (users, isGroupConversation) {

    const exists = await this.find({
        isGroupConversation: false,
        $and: [
            { users: { $elemMatch: { $eq: users[0] } } },
            { users: { $elemMatch: { $eq: users[1] } } },
        ],
    });

    if (exists[0]) {
        throw new Error("Conversation already exists.");
    }

    const newConversation = await this.create({users, isGroupConversation});
    return newConversation;
};

module.exports = mongoose.model("Conversation", conversationSchema);
