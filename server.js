
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./models/post');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', async (req, res) => {
    try {
        const posts = await Post.find({});
        res.render('home', { posts: posts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/compose', (req, res) => {
    res.render('compose');
});

app.post('/compose', async (req, res) => {
    const { title, content } = req.body;
    const post = new Post({ title, content });

    try {
        await post.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/posts/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);
        res.render('post', { post: post });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/edit/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);
        res.render('edit', { post: post });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.post('/edit/:postId', async (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;

    try {
        await Post.findByIdAndUpdate(postId, { title, content });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.post('/delete/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        await Post.findByIdAndDelete(postId);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
