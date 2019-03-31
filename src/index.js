const app = require('./app.js');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is up on port ${PORT}`);
    });
}).catch((err) => {
    console.log('Connection failure', err);
});