const express = require("express");
const router = express.Router();

const {
    login,
    signup,
    addRequest,
    getRequests,
    declineRequest,
    // acceptRequest,
    addRequestByEmail,
    testAuth,
} = require("../controllers/userController");
const { authorize } = require("../middleware/authorize");

// added a route to get a logged in user's incoming requests
router.post("/log-in", login);
router.post("/sign-up", signup);
// router.put("/add-request", authorize, addRequest);
// adding a request with just an email
router.put("/add-request", authorize, addRequestByEmail);
router.put("/decline-request", authorize, declineRequest);
// router.put("/accept-request", authorize, acceptRequest);
// getting user requests
router.get("/get-requests", authorize, getRequests);

// test for authorization
router.get("/test-auth", authorize, testAuth);

module.exports = router;
