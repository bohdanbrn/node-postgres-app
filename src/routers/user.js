const express = require('express');
const router = new express.Router();
const {User} = require('../db/sequelize.js');
const auth = require('../middleware/auth.js')

router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const pass = req.body.password;
        const user = await User.findByCredentials(email, pass);
        const token = await user.generateAuthToken();

        res.header('x-auth', token).send({ user });
    } catch(e) {
        res.status(400).send(e);
    }
});

router.post('/users', async (req, res) => {
    try {
        const user = await User.create(req.body);

        if (!user) {
            res.status(500).send();
        }

        res.status(201).send({ user })
    } catch(e) {
        res.status(400).send(e)
    }
});

router.put('/users/:id', auth, async (req, res) => {
    try {
        const requestId = req.params.id;
        const updates = Object.keys(req.body);
        const allowedUpdates = ['first_name', 'last_name', 'email', 'phone', 'password'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
        
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' });
        }

        try {
            const user = await User.findById(requestId);

            if (!user) {
                return res.status(404).send({ error: 'User not found!' });
            }
            
            updates.forEach((update) => user[update] = req.body[update]);
            await user.save();

            res.send(user);
        } catch (e) {
            res.status(400).send(e);
        }
    } catch (e) {
        res.status(404).send(e);
    }
});

router.get('/users/:id', auth, async (req, res) => {
    try {
        const requestId = req.params.id;
        const user = await User.findById(requestId);
        
        if (!user) {
            return res.status(404).send({ error: 'User not found!' });
        }

        res.send({ user });
    } catch (e) {
        res.status(404).send(e);
    }
});

module.exports = router;