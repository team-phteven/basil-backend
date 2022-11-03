const express = require("express");
const { authorize } = require("../middleware/authorize");
const {
    createConversation,
    getConversations,
    renameGroupConversation,
    addToGroupConversation,
} = require("../controllers/conversationController");

const router = express.Router();

router.get("/", authorize, getConversations);
router.post("/", authorize, createConversation);
router.put("/rename", authorize, renameGroupConversation);
router.put("/add", authorize, addToGroupConversation);

module.exports = router;
