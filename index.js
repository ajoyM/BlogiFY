require('dotenv').config()

const express = require('express');
const path = require('path');
const userRouter = require('./routes/user');
const connectDB = require('./connect');
const cookieParse = require('cookie-parser');
const {checkForAuthentication} = require('./middlewares/auth');
const userBlog = require('./routes/blog');
const Blog = require('./models/blog');

const app = express();
const PORT = process.env.PORT;

connectDB(process.env.MONGOSH_URL)
    .then(() => console.log('Connected to DB'))
    .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.urlencoded({extended: false}));
app.use(cookieParse());
app.use(checkForAuthentication('userToken'))
app.use(express.static(path.resolve('./public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', async(req, res) => {
 //   console.log('user', req.user)
    // let blogs = [];
    // if (req.user) {
    //     blogs = await Blog.find({author: req.user._id});
    // }
    const blogs = await Blog.find();
    res.render('home', {
        user: req.user,
        blogs
    })
});

app.use('/user', userRouter);
app.use('/blog', userBlog);
app.use('/blog/user', userRouter);  

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))