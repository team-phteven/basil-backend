const express = require("express");
const cors = require("cors");
const connectToDB = require("./utils/connectToDB");
const dotenv = require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

// ----- SERVER CONFIG -----

// create app instance
const app = express();
//  connect to database
connectToDB();
// cors
app.use(
    cors({
        origin: "http://localhost:3000",
    })
);

app.listen(process.env.PORT, () => {
    console.log("Express listening on port..." + process.env.PORT);
});

// ----- MIDDLEWARE -----

// use json method
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
