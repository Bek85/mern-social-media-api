const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

//! GET A USER

router.get('/', async (req, res) => {
  const userId = req.query.userId; 
  const username = req.query.username;
  try {
    const user = userId ? await User.findById(userId) : await User.findOne({username: username});
    const { password, isAdmin, ...otherCredentials } = user._doc;
    res.status(200).json(otherCredentials);
  } catch (error) {
    res.status(500).json(error);
  }
});

//! FOLLOW A USER
router.put('/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({
          $push: { following: req.params.id },
        });
        res.status(200).json('User has been followed');
      } else {
        res.status(403).json('You already follow this user');
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});

//! UNFOLLOW A USER
router.put('/:id/unfollow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({
          $pull: { following: req.params.id },
        });
        res.status(200).json('You have stopped following this user');
      } else {
        res.status(403).json("You don't follow this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
});

//! UPDATE A USER
router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    // Update a password
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        res.status(500).json(error);
      }
    }

    // Update a user
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json('Account has been updated');
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json('You can update only your account');
  }
});

//! DELETE A USER
router.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    // delete a user
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('Account has been deleted');
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json('You can delete only your account');
  }
});

module.exports = router;
