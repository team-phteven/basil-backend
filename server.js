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
    cors: { origin: "http://localhost:3000" },
});

io.on("connection", (socket) => {
    console.log("connected to socket");
    socket.on("setup", (email) => {
        socket.join(email);
        socket.emit("connected");
    });

    socket.on("join conversation", (conversation) => {
        socket.join(conversation);
        console.log("User joined conversation:" + conversation);
    });
});

httpServer.listen(5000);

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
