const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const authorize = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            // decode token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(401);
            console.log(error.message);
        }
    } else {
        res.status(401);
        console.log("Not authorized. No token.");
    }
};

module.exports = { authorize };
