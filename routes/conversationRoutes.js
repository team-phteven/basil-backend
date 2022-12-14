const express = require("express");
const { authorize } = require("../middleware/authorize");
const {
    createConversation,
    getConversations,
    renameGroupConversation,
    removeFromGroupConversation,
    addSeconds,
    addUsersToConvo,
} = require("../controllers/conversationController");

const router = express.Router();

router.get("/", authorize, getConversations);
router.post("/", authorize, createConversation);
router.put("/rename", authorize, renameGroupConversation);
router.put("/add-seconds", authorize, addSeconds);
router.put("/add-users", authorize, addUsersToConvo);
router.put("/remove", authorize, removeFromGroupConversation);

module.exports = router;
