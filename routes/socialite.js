const express    = require("express");
const Provider = require('../models/provider.js');
const Services = require('../models/services.js');

const router = express.Router();

router.use((req, res, next) => {
if (req.session.currentUser) {
next();
return;
}
res.redirect('/login');
});

router.get('/dashboard', (req, res, next) => {
  let query;
  if (req.session.currentUser.isProvider) {
  query = { client: req.session.currentUser._id };
  } else {
  query = { user: req.session.currentUser._id };
  }
  ClientConsultation
  .find(query)
  .populate('provider', 'name')
  .populate('services', 'name')
  .sort('consultationDate')
  .exec((err, pickupDocs) => {
  if (err) {
  next(err);
  return;
  }
  res.render('client/dashboard', {
  consultation: consultationDocs
  });
  });
  });

  router.post('/client', (req, res, next) => {
    const userId = req.session.currentUser._id;
    const clientInfo = {
    fee: req.body.fee,
    isClient: true
    };
    User.findByIdAndUpdate(userId, laundererInfo, { new: true }, (err, theUser) => {
    if (err) {
    next(err);
    return;
    }
    req.session.currentUser = theUser;
    res.redirect('/dashboard');
    });
    });

    
    router.get('/client', (req, res, next) => {
      User.find({ isLaunderer: true }, (err, launderersList) => {
      if (err) {
      next(err);
      return;
      }
      
      res.render('client/provider', {
      provider: providerAppointment
      });
      });
      });
      

      router.get('/provider/:id', (req, res, next) => {
        const providerId = req.params.id;
        User.findById(providerId, (err, theUser) => {
        if (err) {
        next(err);
        return;
        }
        res.render('client/provider-profile', {
        theLaunderer: theUser
        });
        });
        });
        router.post('/client-consultation', (req, res, next) => {
        const consultationInfo = {
        pickupDate: req.body.pickupDate,
        launderer: req.body.laundererId,
        user: req.session.currentUser._id
        };
        const theConsultation = new Consultation(consultationInfo);
        thePickup.save((err) => {
        if (err) {
        next(err);
        return;
        }
        res.redirect('/dashboard');
        });
        });


module.exports = router;
