const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        first_name: {
            type: DataTypes.STRING
        },
        last_name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        token: {
            type: DataTypes.STRING
        }
    });

    // Class level methods
    User.findByCredentials = async (email, password) => {
        const user = await User.findOne({
            where: {
                email: email,
            }
        });

        if (!user) {
            throw new Error('Unable to login');
        }
        
        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            throw new Error('Unable to login');
        }

        return user;
    }

    User.findById = async (id) => {
        const user = await User.findOne({
            where: { id }
        });

        return user;
    }

    // Instance level methods
    User.prototype.generateAuthToken = async function () {
        const user = this;
        // TODO (edit privateKey)
        const privateKey = fs.readFileSync('src/config/private.key', {encoding: 'utf-8'});
        const token = jwt.sign({ id: user.id }, privateKey);
    
        user.update({token});
    
        return token;
    }

    User.beforeCreate((user) => {
        if (!user.password) {
            throw new Error("Password not defined!");
        }

        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });
    
    // TODO (maybe delete)
    // User.beforeUpdate((user) => {
    //     if (!user.password) {
    //         throw new Error("Password not defined!");
    //     }

    //     user.password = bcrypt.hashSync(user.previous.password, bcrypt.genSaltSync(10), null);
    // });

    return User;
}