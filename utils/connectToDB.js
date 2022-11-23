const mongoose = require("mongoose");

const connectToDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        process.exit();
    }
};

module.exports = connectToDB;
