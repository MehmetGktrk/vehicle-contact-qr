const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const config = require('./config/config');

const errorMiddleware = require('./middlewares/error.middleware');

const authRoutes = require('./api/authentication/auth.routes');

const app = express();

app.use(cors({
    origin: config.frontendUrl, // Allow requests from the frontend URL
    credentials: true,
}));

app.use(express.json());

app.use(cookieParser());

app.use('/api/auth', authRoutes);



app.use(errorMiddleware);

module.exports = app;
