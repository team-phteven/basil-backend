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
        groupName: { type: String, trim: true },
    },
    { timestamps: true }
);

conversationSchema.statics.new = async function (
    users,
    isGroupConversation,
    groupName
) {
    // is the 'exists' code obselete?
    // UPDATE: Lag on the front end can bypass the check on the request, I think we should leave this check here as
    // well, just in case.

    // TO-DO: For some reason this error was throwing even for group conversations, I've wrapped it in an if statement but really
    // we should try and get the db query working properly. `isGroupConversation: false, $and: ` should have worked??
    if (!isGroupConversation) {
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
    }

    let billableSeconds = {};
    for (let user of users) {
        billableSeconds[user] = 0;
    }

    const conversation = isGroupConversation
        ? { users, isGroupConversation, billableSeconds, groupName }
        : { users, isGroupConversation, billableSeconds };

    const newConversation = await this.create(conversation);
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

    // adds the user id as key and 0 as value to that billable seconds property
    userIds.forEach((user) => {
        bill.set(user, bill.get(user) ? bill.get(user) : 0);
        // conversationUsers.push(user);
    });

    // updates the conversation with new billable seconds property with added users and adds each user id to its users property
    const updatedConversation = await this.findByIdAndUpdate(
        conversationId,
        {
            billableSeconds: bill,
            $push: {
                users: { $each: userIds },
            },
        },
        {
            new: true,
        }
    ).populate("users", "-password");

    return updatedConversation;
};

module.exports = mongoose.model("Conversation", conversationSchema);
