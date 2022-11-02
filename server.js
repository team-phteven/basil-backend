const express = require('express');
const connectToDB = require('./utils/connectToDB');
const dotenv = require(dotenv).config();

// ----- SERVER CONFIG -----

// create app instance
const app = express();
//  connect to database
connectToDB();

app.listen(process.env.PORT, () => {
    console.log("Express listening on port...");
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

app.use("/routes/messageRoutes", messageRoutes);
app.use("/routes/userRoutes", userRoutes);