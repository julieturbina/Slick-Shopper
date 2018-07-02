const express = require('express');
const router  = express.Router();

// movie project below==========
// const Movie = require('../models/movie.js');
// const uploadCloud = require('../config/cloudinary.js');
// movie project above ===============

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;





/* mpvie project below========
/* GET home page */
// router.get('/', (req, res, next) => {
//   Movie.find()
//   .then((movies) => {
//     res.render('index', { movies });
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// });

// router.get('/movie/add', (req, res, next) => {
//   res.render('movie-add');
// });

// router.post('/movie/add', uploadCloud.single('photo'), (req, res, next) => {
//   const { title, description } = req.body;
//   const imgPath = req.file.url;
//   const imgName = req.file.originalname;
//   const newMovie = new Movie({title, description, imgPath, imgName})
//   newMovie.save()
//   .then(movie => {
//     res.redirect('/');
//   })
//   .catch(error => {
//     console.log(error)
//   })
// });

// module.exports = router;
// */ movie project above =========
