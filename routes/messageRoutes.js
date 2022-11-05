const express = require("express");

const { authorize } = require("../middleware/authorize");
const {
    sendMessage,
    getMessages,
} = require("../controllers/messagesController");

const router = express.Router();

router.get("/", authorize, getMessages);
router.post("/", authorize, sendMessage);

module.exports = router;
