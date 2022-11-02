const express = require('express');
const connectToDB = require('./utils/connectToDB');
const dotenv = require(dotenv).config();

// create app instance
const app = express();

//  connect to database
connectToDB();