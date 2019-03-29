const Sequelize = require('sequelize');
const userModel = require('../models/user.js');

const dbName = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    dialect: 'postgres'
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