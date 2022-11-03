const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    body: { type: String, trim: true },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
