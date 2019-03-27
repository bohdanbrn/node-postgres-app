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

router.get('/users/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            res.status(500).send();
        }

        res.send({ user });
    } catch (e) {
        res.status(404).send(e);
    }
});

module.exports = router;