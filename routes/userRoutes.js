const express = require("express");
const router = express.Router();

const {
    login,
    signup,
    addRequest,
    declineRequest,
    acceptRequest,
    testAuth,
} = require("../controllers/userController");
const { authorize } = require("../middleware/authorize");

router.post("/log-in", login);
router.post("/sign-up", signup);
router.put("/add-request", authorize, addRequest);
router.put("/decline-request", authorize, declineRequest);
// router.put("/accept-request", authorize, acceptRequest);

// test for authorization
router.get("/test-auth", authorize, testAuth);

module.exports = router;
