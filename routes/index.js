const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  // review and test============below
  // res.render('login');
  ////////////review and test above vs below===
  res.render('index');
});

module.exports = router;

