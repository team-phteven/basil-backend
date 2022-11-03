const express = require("express");
const { authorize } = require("../middleware/authorize");
const {
    createConversation,
    getConversations,
} = require("../controllers/conversationController");

const router = express.Router();

router.get("/", authorize, getConversations);
router.post("/", createConversation);

module.exports = router;
