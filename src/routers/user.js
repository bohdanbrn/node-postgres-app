const express = require('express');
const router = new express.Router();
const {User} = require('../db/sequelize.js');

router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const pass = req.body.password;
        const user = await User.findByCredentials(email, pass);
        const token = await user.generateAuthToken();

        res.send({ user, token });
    } catch(e) {
        res.status(400).send(e);
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            res.status(500).send();
        }

        res.send(user);
    } catch (e) {
        res.status(404).send(e);
    }
});

module.exports = router;