const express = require("express");
const connectToDB = require("./utils/connectToDB");
const dotenv = require("dotenv").config();
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

// ----- SERVER CONFIG -----

// web socket server initialization
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: process.env.SOCKET_URI },
});

io.on("connection", (socket) => {
    socket.on("setup", (email) => {
        socket.join(email);
    });

    socket.on("new message", (newMessageReceived) => {
        let conversation = newMessageReceived.conversation;

        if (!conversation.users) return;

        conversation.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) return;

            io.in(user.email).emit("message received", newMessageReceived);
        });
    });
});

httpServer.listen(process.env.PORT || 5000);

//  connect to database
connectToDB();

// ----- MIDDLEWARE -----
app.use(cors());
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
