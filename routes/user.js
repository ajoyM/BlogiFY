const {Router} = require('express');
const User = require('../models/user');
const {validToken} = require('../services/auth');

const router = Router();


router.get('/signin', (req, res) => {
    res.render('signin')
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.get('/logout', (req, res) => {
    return res.clearCookie('userToken').redirect('/');
})

router.post('/signin', async (req, res) => {
    const {email, password} = req.body;
    console.log(email, password)
    try {
        const userToken = await User.matchPasswordAndCreateToken(email, password);
        res.cookie('userToken', userToken);
        // const user = validToken(userToken);
        //  console.log('....user', user);
        // req.session.user = user;
        return res.redirect('/');
    } catch (error) {
        return res.render('signin', {error: "Invalid email or password"});
    }

})

router.post('/signup', async (req, res) => {
    console.log(req.body)
    const {fullName, email, password} = req.body;
    await User.create({
        fullName,
        email,
        password
    });
    return res.redirect('/');
});

module.exports = router;