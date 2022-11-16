const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { findById } = require("./conversationModel");

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
        default: `http://localhost:3000/avatar.svg`,
    },
    contacts: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        }
    ],
    requests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    // conversations: [
    //     {
    //         type: mongoose.SchemaTypes.ObjectId,
    //         ref: Conversation,
    //     },
    // ],
});

// ----- STATIC METHODS -----

userSchema.statics.signup = async function (
    firstName,
    lastName,
    email,
    password,
    avatar
) {
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
        avatar = `${process.env.SOCKET_URI}/avatar${
            Math.floor(Math.random() * 5) + 1
        }.svg`;
    }

    const exists = await this.findOne({ email });
    if (exists) {
        throw Error("Email already in use.");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({
        firstName,
        lastName,
        email,
        password: hash,
        avatar,
    });

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

userSchema.statics.addRequestByEmail = async function (localId, email) {
    // find requested user by email and push the logged in user's id to their requests
    // addToSet means it will push to the array only if it is not already there

    // find user by email and add the logged in user
    const user = await this.findOneAndUpdate(
        { email: email },
        { $addToSet: { requests: localId } },
        { new: true }
    );
    // throw error if user doesn't exist
    if (!user) {
        throw Error("User with this ID does not exist.");
    }
    return user;
};

userSchema.statics.removeRequest = async function (acceptedId, localId) {
    const user = await this.findByIdAndUpdate(
        { _id: localId },
        { $pull: { requests: acceptedId } },
        { new: true }
    ).populate("requests", "-password");
    // throw error if user doesn't exist
    if (!user) {
        throw Error("User with this ID does not exist.");
    }
    return user.requests;
};

userSchema.statics.updateDetails = async function ({
    _id,
    firstName,
    lastName,
    email,
}) {
    console.log(email);

    if (!firstName || !lastName || !email) {
        throw Error("All fields must be complete");
    }

    const user = await this.findByIdAndUpdate(
        { _id },
        { firstName, lastName, email },
        { new: true }
    );

    if (!user) {
        throw Error("Cannot update this User");
    }

    return user;
};

userSchema.statics.deleteAvatar = async function ({
    _id,
}) {

    const avatar = `${process.env.SOCKET_URI}/avatar${
        Math.floor(Math.random() * 5) + 1
    }.svg`;

    const user = await this.findByIdAndUpdate(
        { _id },
        { avatar },
        { new: true }
    );

    if (!user) {
        throw Error("Cannot update this User");
    }

    return user;
};

userSchema.statics.updateAvatar = async function ({ _id, avatar }) {
    if (!avatar) {
        throw Error("No avatar attached to request");
    }

    const user = await this.findByIdAndUpdate(
        { _id },
        { avatar },
        { new: true }
    );

    if (!user) {
        throw Error("Cannot update this User");
    }

    return user;
};

userSchema.statics.updatePassword = async function ({
    _id,
    oldPassword,
    newPassword,
}) {
    if (!oldPassword || !newPassword) {
        throw Error("All fields must be complete");
    }

    let user = await this.findOne({ _id });

    if (!user) {
        throw Error("User not found.");
    }

    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) {
        throw Error("Incorrect password");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    user = await this.findByIdAndUpdate(
        { _id },
        { password: hash },
        { new: true }
    );

    return user;
};

userSchema.statics.addContact = async function (contactId, _id) {

    // Find by ID and add contact's ID to contacts
    const user = await this.findByIdAndUpdate(
        { _id },
        { $addToSet: { contacts: contactId } },
        { new: true }
    );

    if (!user) {
        throw Error("Cannot update this User");
    }

};


userSchema.statics.getContacts = async function ({
    _id
}) {
    const user = this.findById(_id).populate(
        "contacts",
        "-password"
    );

    return user
}

module.exports = mongoose.model("User", userSchema);
