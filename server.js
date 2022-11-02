const express = require('express');
const connectToDB = require('./utils/connectToDB');
const dotenv = require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

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

app.use("/api/users", userRoutes);