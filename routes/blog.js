const {Router} = require('express');
const router = Router();
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');
const Comment = require('../models/comment');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./public/uploads'))
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null, fileName)
  }
})

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user
    })
});

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author');
  const comments = await Comment.find({blogId: req.params.id}).populate('createdBy');
  const searchTerm = 'full'; // or any dynamic input

   const result = await Blog.find({
  title: { $regex: searchTerm, $options: 'i' } // 'i' for case-insensitive
  });
  console.log('...kkkkk', result)
    return res.render('blog', {
        user: req.user,
        blog,
        comments
    })
});

router.post('/comment/:blogId', async(req, res) => {
   console.log('.......blog', req.params)
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id
    });
     
  return res.redirect(`/blog/${req.params.blogId}`);
})

router.post('/', upload.single('coverImage'), async(req, res) => {
    const {title, description} = req.body;
    const blog = await Blog.create({
          title,
          description,
          coverImage: `uploads/${req.file.filename}`,
          author: req.user._id
    })
    return res.redirect(`/blog/${blog._id}`)
})

module.exports = router;