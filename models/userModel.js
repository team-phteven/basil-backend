const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
        default: 'http://localhost:3000/avatar.png'
    },
    requests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    // conversations: [
    //     {
    //         type: mongoose.SchemaTypes.ObjectId,
    //         ref: Conversation,
    //     },
    // ],
});

// ----- STATIC METHODS -----

userSchema.statics.signup = async function (firstName,  lastName, email, password, avatar) {
    if (!firstName || !lastName || !email || !password) {
        throw Error("All fields must be filled.");
    }
    if (!validator.isEmail(email)) {
        throw Error("Email is not valid");
    }
    // if (!validator.isStrongPassword(password)) {
    //     throw Error("Password not strong enough");
    // }
    if (!avatar) {
        avatar = "http://localhost:3000/avatar.png";
    }

    const exists = await this.findOne({ email });
    if (exists) {
        throw Error("Email already in use.");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ firstName, lastName, email, password: hash, avatar });

    return user;
};

userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error("All fields must be filled.");
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw Error("Incorrect email.");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error("Incorrect password");
    }

    return user;
};

userSchema.statics.addRequest = async function (contactId, _id) {
    // find requested user by email and push the logged in user's id to their requests
    // addToSet means it will push to the array only if it is not already there
    const user = await this.findByIdAndUpdate(
        { contactId },
        { $addToSet: {requests: _id }},
        { new: true }
    );
    // throw error if user doesn't exist
    if (!user) {
        throw Error("User with this email does not exist.");
    }
    return user;
};

userSchema.statics.denyRequest = async function (contactId, _id) {
    // find requested user by email and push the logged in user's id to their requests
    // addToSet means it will push to the array only if it is not already there
    const user = await this.findByIdAndUpdate(
        { contactId },
        { $addToSet: { requests: _id } },
        { new: true }
    );
    // throw error if user doesn't exist
    if (!user) {
        throw Error("User with this email does not exist.");
    }
    return user;
};

module.exports = mongoose.model("User", userSchema);