const request = require('supertest');
const app = require('../src/app.js');
const jwt = require('jsonwebtoken');
const { models } = require('../src/models');
const { setupDatabase, users } = require('./fixtures/db');

let userAuthToken = '';

beforeAll(setupDatabase);

describe('POST /users', () => {
    test('Should create a new user', async () => {
        const response = await request(app).post('/users').send(users.userOne).expect(201);

        // Assert that the database was changed correctly
        const user = await models.User.findByCredentials(
            users.userOne.email,
            users.userOne.password
        );
        expect(user).not.toBeNull();
        
        // Assertions about the response
        expect(response.body).toMatchObject({
            user: {
                first_name: users.userOne.first_name,
                last_name: users.userOne.last_name,
                email: users.userOne.email,
                phone: users.userOne.phone,
            }
        });

        expect(user.password).not.toBe(users.userOne.password);
    });

    test('Should not create a new user with exists email', async () => {
        await request(app).post('/users').send(users.userOne).expect(400);
    });

    test('Should not create a new user with not valid first_name', async () => {
        await request(app).post('/users').send(users.userTwo).expect(400);
    });

    test('Should not create a new user with not valid last_name', async () => {
        await request(app).post('/users').send(users.userThree).expect(400);
    });

    test('Should not create a new user with not valid email', async () => {
        await request(app).post('/users').send(users.userFour).expect(400);
    });

    test('Should not create a new user with not valid phone', async () => {
        await request(app).post('/users').send(users.userFive).expect(400);
    });
});

describe('POST /login', () => {
    test('Should login existing user', async () => {
        const response = await request(app).post('/login').send({
            email: users.userOne.email,
            password: users.userOne.password
        }).expect(200);

        expect(response.header).toHaveProperty('x-auth');
        expect(response.header).not.toBe('');

        // decoded auth token and check id
        const token = response.header['x-auth'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded.id).toBe(response.body.user.id);

        // save auth token for next tests
        userAuthToken = response.header['x-auth'];
    });

    test('Should not login with wrong email', async () => {
        await request(app).post('/login').send({
            email: 'wrong@email.com',
            password: users.userOne.password
        }).expect(400);
    });

    test('Should not login with wrong password', async () => {
        await request(app).post('/login').send({
            email: users.userOne.email,
            password: 'wrongPassword'
        }).expect(400);
    });

    test('Should not login nonexistent user', async () => {
        await request(app).post('/login').send({
            email: users.userTwo.email,
            password: users.userTwo.password
        }).expect(400);
    });
});

describe('PUT /users/:id', () => {
    test('Should update user data', async () => {
        await request(app)
            .put('/users/1')
            .set('x-auth', userAuthToken)
            .send(users.userSix)
            .expect(200);

        const user = await models.User.findByCredentials(
            users.userSix.email,
            users.userSix.password
        );

        delete users.userSix.password;

        expect(user).toMatchObject(users.userSix);
    });

    test('Should not update user data with wrong token', async () => {
        await request(app)
            .put('/users/1')
            .set('x-auth', 'wrongToken')
            .send(users.userOne)
            .expect(401);
    });

    test('Should not update non-existent user', async () => {
        await request(app)
            .put('/users/999')
            .set('x-auth', userAuthToken)
            .send(users.userOne)
            .expect(404);
    });
});

describe('GET /users/:id', () => {
    test('Should get user data', async () => {
        await request(app)
            .get('/users/1')
            .set('x-auth', userAuthToken)
            .expect(200);
    });

    test('Should not get user data with wrong token', async () => {
        await request(app)
            .get('/users/1')
            .set('x-auth', 'wrongToken')
            .expect(401);
    });

    test('Should not get data for non-existent user', async () => {
        await request(app)
            .get('/users/999')
            .set('x-auth', userAuthToken)
            .expect(404);
    });
});