const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

//! GET A USER

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, isAdmin, ...otherCredentials } = user._doc;
    res.status(200).json(otherCredentials);
  } catch (error) {
    res.status(500).json(error);
  }
});

//! FOLLOW A USER
router.put('/', (req, res) => {});

//! UNFOLLOW A USER
router.put('/', (req, res) => {});

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
