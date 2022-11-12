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
    console.log("new socket connection: " + socket.id)
    socket.on("setup", (email) => {
        console.log("socket connect with email: " + email)
        socket.join(email);
    });

    socket.on("new message", (newMessageReceived) => {
        let conversation = newMessageReceived.conversation;

        if (!conversation.users) return console.log("no users in the convo");
        console.log(newMessageReceived)
        conversation.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) return;

            io.in(user.email).emit("message received", newMessageReceived);
            console.log(
                "new message received by:" +
                    user.email +
                    " :" +
                    newMessageReceived.content
            );
        });
    });
});

httpServer.listen(process.env.PORT || 5000);

//  connect to database
connectToDB();

// io.on("connection", (socket) => {
//     console.log("socket log: ---" + socket.id); // x8WIv7-mJelg7on_ALbx
// });

// server.listen(process.env.PORT, () => {
//     console.log("Express listening on port..." + process.env.PORT);
// });

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
