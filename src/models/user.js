const fs = require('fs');
const jwt = require('jsonwebtoken');

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

    // class level method
    User.findByCredentials = async (email, pass) => {
        const user = await User.findOne({
            where: {
                email: email,
                password: pass
            }
        });
        
        return user;
    }

    // instance level method
    User.prototype.generateAuthToken = async function() {
        const user = this;
        const privateKey = fs.readFileSync('src/config/private.key', {encoding: 'utf-8'});
        const token = jwt.sign({ id: user.id }, privateKey);
    
        user.update({token});
    
        return token;
    }
    
    return User;
}