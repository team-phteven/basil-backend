const express = require("express");
const {
    createConversation,
    getConversations,
} = require("../controllers/conversationController");

const router = express.Router();

router.get("/", getConversations);
router.post("/", createConversation);

module.exports = router;
