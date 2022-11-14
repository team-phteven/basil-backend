const mongoose = require("mongoose");
const User = require("./userModel");

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
        billableSeconds: {
            type: Map,
            of: Number,
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

    let billableSeconds = {};
    console.log("users array passed to backend:  " + users);
    for (let user of users) {
        // user = await User.findById(user);
        // billableSeconds[`${user._id}-${user.firstName}`] = 0;
        billableSeconds[user] = 0;
    }

    const newConversation = await this.create({
        users,
        isGroupConversation,
        billableSeconds,
    });
    console.log(newConversation);
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
    userId,
    seconds
) {
    const conversation = await this.findById(conversationId);
    const bill = conversation.billableSeconds;
    const newSeconds = bill.get(userId) + seconds;
    bill.set(userId, newSeconds);

    const updatedConversation = await this.findByIdAndUpdate(
        conversationId,
        {
            billableSeconds: bill,
        },
        {
            new: true,
        }
    );

    return updatedConversation;
};

conversationSchema.statics.getInfo = async function (conversationId) {
    const conversation = await Conversation.findById(conversationId);

    for (let user of conversation.users) {
        user = await User.findById(user._id);
        billableSeconds[`${user._id}-${user.firstName}`] = 0;
        billableSeconds[user] = 0;
    }

    return conversation;
};

module.exports = mongoose.model("Conversation", conversationSchema);
