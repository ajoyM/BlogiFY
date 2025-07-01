const {Schema, model} = require('mongoose');
const crypto = require('crypto');
const { createHmac } = require('crypto');
const {createAuthToken} = require('../services/auth');


const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: '/images/profile.png'
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, {
    timeStamps: true
});

userSchema.pre('save', function (next) {
 const user = this;
 if(!user.isModified('password')) return;

 const salt = crypto.randomBytes(16).toString();
 const hashPassword = createHmac('sha256', salt)
               .update(user.password)
               .digest('hex');
this.salt = salt;
this.password = hashPassword;
next();
});

userSchema.static('matchPasswordAndCreateToken', async function (email, password) {
    const user = await this.findOne({email});
    if (!user) throw new Error('user is not found');
    const hashPassword = createHmac('sha256', user.salt)
               .update(password)
               .digest('hex');
    if (user.password !== hashPassword) throw new Error('Invalid password');
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        photo: user.photo,
        role: user.role
    }
    const userToken = createAuthToken(user);
    return userToken;
});

const User = model('user', userSchema);
module.exports = User;