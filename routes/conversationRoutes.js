const express = require("express");
const { authorize } = require("../middleware/authorize");
const {
    createConversation,
    getConversations,
    renameGroupConversation,
    addToGroupConversation,
    removeFromGroupConversation,
} = require("../controllers/conversationController");

const router = express.Router();

router.get("/", authorize, getConversations);
router.post("/", authorize, createConversation);
router.put("/rename", authorize, renameGroupConversation);
router.put("/add", authorize, addToGroupConversation);
router.put("/remove", authorize, removeFromGroupConversation);

module.exports = router;
