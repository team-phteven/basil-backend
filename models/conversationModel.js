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
        billedSeconds: { type: Number },
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

    const newConversation = await this.create({ users, isGroupConversation });
    return newConversation;
};

conversationSchema.statics.addLatestMessage = async function (
    conversationId,
    messageId
) {
    const updatedConversation = await this.findByIdAndUpdate(
        { _id: conversationId },
        { latestMessage: messageId },
        { new: true }
    );
    return updatedConversation;
};

conversationSchema.statics.addSeconds = async function (
    conversationId,
    seconds
) {
    const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
            $inc: { billedSeconds: seconds },
        },
        {
            new: true,
        }
    );
    return updatedConversation;
};

conversationSchema.statics.settleBill = async function (conversationId) {
    const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
            billedSeconds: 0,
        },
        {
            new: true,
        }
    );
    return updatedConversation;
};

module.exports = mongoose.model("Conversation", conversationSchema);
