const express = require("express");
const router = express.Router();

const {
    login,
    signup,
    addRequest,
    declineRequest,
    testAuth,
    getRequests,
    updateDetails,
    updatePassword,
    deleteAvatar,
    updateAvatar
} = require("../controllers/userController");
const { authorize } = require("../middleware/authorize");

router.post("/log-in", login);
router.post("/sign-up", signup);
router.put("/add-request", authorize, addRequest);
router.put("/decline-request", authorize, declineRequest);
router.put("/update-details", authorize, updateDetails);
router.put("/update-password", authorize, updatePassword);
router.put("/update-avatar", authorize, updateAvatar);
router.put("/delete-avatar", authorize, deleteAvatar);
router.get("/get-requests", authorize, getRequests);

// test for authorization
router.get("/test-auth", authorize, testAuth);

module.exports = router;
