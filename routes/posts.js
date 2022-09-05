const router = require('express').Router();
const Post = require('../models/Post');

//! GET A POST
router.get('/', (req, res) => {});

//! GET ALL POSTS

//! CREATE A POST
router.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

//! UPDATE A POST

//! LIKE A POST

//! DELETE A POST

module.exports = router;
