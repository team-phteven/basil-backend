const express = require("express");
const connectToDB = require("./utils/connectToDB");
const dotenv = require("dotenv").config();
const cors = require('cors');

const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

// ----- SERVER CONFIG -----

// create app instance
const app = express();
//  connect to database
connectToDB();

app.listen(process.env.PORT, () => {
    console.log("Express listening on port..." + process.env.PORT);
});

// ----- MIDDLEWARE -----
app.use(cors())
app.use(express.json());

// log requests
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// ----- ROUTERS -----

// app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
