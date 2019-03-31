const { sequelize } = require('../../src/models');

// function for connect to Database
const setupDatabase = async () => {
    await sequelize.sync({ force: true });
}

// object with test users
const users = {};

users.userOne = {
    first_name: "User",
    last_name: 'One',
    email: 'user1@mail.com',
    phone: '380933333333',
    password: 'testPass1111'
}

// user data with not valid first_name
users.userTwo = {
    first_name: "User2",
    last_name: 'Two',
    email: 'user2@mail.com',
    password: 'testPass222'
}

// user data with not valid last_name
users.userThree = {
    first_name: "User",
    last_name: 'Three3',
    email: 'user3@mail.com',
    password: 'testPass333'
}

// user data with not valid email
users.userFour = {
    first_name: "User",
    last_name: 'Four',
    email: 'mail.com',
    password: 'testPass444'
}

// user data with not valid phone
users.userFive = {
    first_name: "User",
    last_name: 'Five',
    email: 'user5@mail.com',
    phone: 'qwerty',
    password: 'testPass555'
}

users.userSix = {
    first_name: "User",
    last_name: 'Six',
    email: 'user6@mail.com',
    phone: '111111111',
    password: 'testPass666'
}

module.exports = {
    setupDatabase,
    users
}