const jwt = require('jsonwebtoken')
const { models } = require('../models');

const auth = async (req, res, next) => {
    try {
        const token = req.header('x-auth');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await models.User.findOne({
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