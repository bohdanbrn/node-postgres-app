const express = require('express');
const {sequelize, user} = require('./models');
const userRouter = require('./routers/user.js');

const app = express();

app.use(express.json());
app.use(userRouter);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is up on port ${PORT}`);
    });
}).catch((err) => {
    console.log('Connection failure', err);
});