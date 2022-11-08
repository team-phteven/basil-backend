const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, trim: true },
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
        },
        seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
