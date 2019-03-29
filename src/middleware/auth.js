const fs = require('fs');
const jwt = require('jsonwebtoken')
const {User} = require('../db/sequelize.js');

const auth = async (req, res, next) => {
    try {
        const privateKey = process.env.JWT_SECRET;
        const token = req.header('x-auth');
        const decoded = jwt.verify(token, privateKey);
        const user = await User.findOne({
            where: {
                id: decoded.id,
                token
            }
        });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;

        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth;