const express = require('express');
const userRouter = require('./routers/user.js');

const app = express();

app.use(express.json());
app.use(userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});