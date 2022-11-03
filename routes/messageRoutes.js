const express = require("express");

const { authorize } = require("../middleware/authorize");
const { sendMessage } = require("../controllers/messagesController");

const router = express.Router();

// router.get("/", authorize, getConversations);
router.post("/", authorize, sendMessage);

module.exports = router;
