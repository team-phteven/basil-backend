const express = require("express");
const app = express();
const connectToDB = require("./utils/connectToDB");
const dotenv = require("dotenv").config();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

// ----- SERVER CONFIG -----

//  connect to database
connectToDB();

server.listen(process.env.PORT, () => {
    console.log("Express listening on port..." + process.env.PORT);
});

io.on("connection", (socket) => {
    console.log("a user connected");
});

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
