const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

// Middleware functions for authorizing users by checking their bearer token
const authorize = async (req, res, next) => {
    let token = "";
    // check if request has a bearer token in headers, otherwise return 401 Not Authorized
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        // verify token against secret, return 401 if unsuccessful
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // using the id from the token, find the user to add to request (filter out password)
            req.user = await User.findById(decoded._id).select("-password");
            console.log("authorized user: " + req.user)
            // go to next action, the req now contains a 'user' property with user's details
            next();
        } catch (error) {
            res.status(401).json({
                message:
                    "Token verification failed. There was a token attached but it was not valid.",
            });
            console.log("Token verification failed.");
        }
    } else {
        res.status(401).json({ message: "Not authorized. Missing token." });
        console.log("Not authorized. Missing token.");
    }
};

module.exports = { authorize };
