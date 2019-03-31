const express = require('express');
const router = new express.Router();
const {models} = require('../models');
const auth = require('../middleware/auth.js');
const socketio = require('socket.io');
const io = socketio();

router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const pass = req.body.password;
        const user = await models.User.findByCredentials(email, pass);
        const token = await user.generateAuthToken();

        res.header('x-auth', token).send({ user });
    } catch(e) {
        res.status(400).send(e);
    }
});

router.post('/users', async (req, res) => {
    try {
        const user = await models.User.create(req.body);

        if (!user) {
            res.status(500).send();
        }

        res.status(201).send({ user });
    } catch(e) {
        res.status(400).send(e);
    }
});

router.put('/users/:id', auth, async (req, res) => {
    try {
        const requestId = req.params.id;
        const user = await models.User.findById(requestId);

        if (!user) {
            return res.status(404).send({ error: 'User not found!' });
        }

        // update user data
        await user.update(req.body);

        // send a message to room "updates" after update user
        io.sockets.in('updates').emit('message', {
            userId: user.id,
            text: "User was updated",
            createdAt: new Date().getTime()
        });

        res.send(user);
    } catch (e) {
        res.status(404).send(e);
    }
});

router.get('/users/:id', auth, async (req, res) => {
    try {
        const requestId = req.params.id;
        const user = await models.User.findById(requestId);
        
        if (!user) {
            return res.status(404).send({ error: 'User not found!' });
        }

        res.send({ user });
    } catch (e) {
        res.status(404).send(e);
    }
});

module.exports = router;