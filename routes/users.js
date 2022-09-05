const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('test users route');
});

module.exports = router;
