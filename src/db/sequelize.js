const Sequelize = require('sequelize');
const userModel = require('../models/user.js');

const sequelize = new Sequelize('test', 'postgres', '1111', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    pool: {
        max: 10,
        min: 0,
        idle: 10000
    }
});

const User = userModel(sequelize, Sequelize);

sequelize.sync();
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection established');
    })
    .catch((err) => {
        console.log('Connection failure', err);
    });

module.exports = {User};