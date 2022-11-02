const express = require("express");
const router = express.Router();

const { login, signup, testAuth } = require("../controllers/userController");
const { authorize } = require("../middleware/authorize");

router.post("/login", login);
router.post("/signup", signup);
router.get("/testAuth", authorize, testAuth);

module.exports = router;