const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//! REGISTER FLOW

router.post('/register', async (req, res) => {
  try {
    // hash received password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create a new user
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // save created user to backend and return response
    const user = newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//! LOGIN FLOW

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) res.status(401).send('Wrong credentials');

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json('Wrong password');

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
