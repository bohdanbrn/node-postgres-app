const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            trim: true,
            validate: {
                is: ["^[a-z]+$",'i'] // only letters
            }
        },
        last_name: {
            type: DataTypes.STRING,
            trim: true,
            validate: {
                is: ["^[a-z]+$",'i'] // only letters
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            trim: true,
            validate: {
                isEmail: true,
            }
        },
        phone: {
            type: DataTypes.STRING,
            trim: true,
            validate: {
                validatePhone: function(value) {
                   if(!/^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm.test(value)) {
                      throw new Error('Phone format error!');
                   }
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
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
        const privateKey = process.env.JWT_SECRET;
        const token = jwt.sign({ id: user.id }, privateKey);
    
        user.update({ token });
    
        return token;
    }

    // hash password after create user
    User.beforeCreate((user) => {
        if (!user.password) {
            throw new Error("Password not defined!");
        }

        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });
    
    // hash password after update user
    User.beforeUpdate((user) => {
        if (!user.password) {
            throw new Error("Password not defined!");
        }

        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });

    return User;
}