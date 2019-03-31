const express = require('express');
const userRouter = require('./routers/user.js');

const app = express();

app.use(express.json());
app.use(userRouter);

module.exports = app;