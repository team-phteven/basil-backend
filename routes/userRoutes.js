const express = require("express");
const router = express.Router();

const { login, signup, addRequest } = require("../controllers/userController");

router.post("/login", login);
router.post("/signup", signup);
router.post("/addRequest", addRequest);

module.exports = router;