const jwt = require('jsonwebtoken');
const secretKey = 'Ajoy@123';


function createAuthToken(user) {
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        photo: user.photo
    };
    const token = jwt.sign(payload, secretKey);
    return token;
}

function validToken(token) {
    try {
      //  console.log('token', token)
        return jwt.verify(token, secretKey);
    } catch (error) {
        return false;
    }
}

module.exports = {
    createAuthToken, validToken
}