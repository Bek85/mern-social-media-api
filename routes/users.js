const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

//! GET A USER

router.get('/', (req, res) => {});

//! FOLLOW A USER
router.put('/', (req, res) => {});

//! UNFOLLOW A USER
router.put('/', (req, res) => {});

//! UPDATE A USER
router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.user.isAdmin) {
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
router.delete('/', async (req, res) => {});

module.exports = router;
