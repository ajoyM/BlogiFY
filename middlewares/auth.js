const { validToken } = require("../services/auth");

function checkForAuthentication(cookieName) {
    return (req, res, next) => {
        const userToken = req.cookies[cookieName];
        if(!userToken) {
            return next();
        }
        try {
        const user = validToken(userToken);
       // console.log('pppppppppp', user)
        req.user = user;
        } catch (eror) {

        }
        return next();
    }
}

module.exports = {
    checkForAuthentication
}