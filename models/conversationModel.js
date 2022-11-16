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

conversationSchema.statics.addUsersToConvo = async function (
    conversationId,
    userIds
) {
    // finds conversation based on convo id passed in
    const conversation = await this.findById(conversationId);
    // gets the billable seconds property on that convo
    const bill = conversation.billableSeconds;
    let conversationUsers = conversation.users;
    console.log("model hit!=====>");

    // adds the user id as key and 0 as value to that billable seconds property
    userIds.forEach((user) => {
        bill.set(user, bill.get(user) ? bill.get(user) : 0);
        // conversationUsers.push(user);
    });
    console.log("bill after forEach:   " + bill);

    // updates the conversation with new billable seconds property with added users and adds each user id to its users property
    const updatedConversation = await this.findByIdAndUpdate(
        conversationId,
        {
            billableSeconds: bill,
            $push: {
                users: { $each: userIds },
            },
        },
        // {
        //     users: conversationUsers,
        // },
        {
            new: true,
        }
    );

    console.log("updatedConversation from model!=====>" + updatedConversation);

    return updatedConversation;
};

module.exports = mongoose.model("Conversation", conversationSchema);
