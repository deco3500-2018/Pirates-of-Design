/*
The code snippet below has been adapted from

Node JS Configuration
https://www.youtube.com/watch?v=uONz0lEWft0&list=PLillGF-RfqbZMNtaOXJQiDebNXjVapWPZ

I have used their reference to make my own function. The function here is connected to the node js server.
*/

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Referral = require('../models/Referral');
const path = require('path');

router.get('/example', function (req, res) {
  res.send('Hello SomeRoute!');
});

// referral-detail
router.get('/gp/referral/:id/backend', function (req, res) {
  Referral.find({'_id': req.params.id}, ['name', 'patient_name', 'patient_address', 'patient_phonum', 'patient_dob', 'description', 'gp_id', 'state', 'physician_id', 'created_at', 'category'], function(err,Referrals){
    res.send(Referrals);
  });
})

router.get('/physician/referral/:id/backend', function (req, res) {
  Referral.find({'_id': req.params.id}, ['name', 'patient_name', 'patient_address', 'patient_phonum', 'patient_dob', 'description', 'gp_id', 'state', 'physician_id', 'created_at', 'category'], function(err,Referrals){
    res.send(Referrals);
  });
})

router.get('/physician/referral-wait/:id/backend', function (req, res) {
  Referral.find({'_id': req.params.id}, ['name', 'patient_name', 'patient_address', 'patient_phonum', 'patient_dob', 'description', 'gp_id', 'state', 'physician_id', 'created_at', 'category'], function(err,Referrals){
    res.send(Referrals);
  });
})

router.get('/chat/:id/backend', function (req, res) {
  res.send({'id':req.params.id})
})

router.use('/', express.static(path.join(__dirname, '../public')));
router.use('/signup', express.static(path.join(__dirname, '../public/signup.html')));
router.use('/login', express.static(path.join(__dirname, '../public/login.html')));
router.use('/aboutus', express.static(path.join(__dirname, '../public/aboutus.html')));
router.use('/chat/*', express.static(path.join(__dirname, '../public/chatpage.html')));

router.get('/gp', function(req, res, next){
  return res.redirect('/gp/referral');
});

router.get('/physician', function(req, res, next){
  return res.redirect('/physician/schedule');
});

router.use('/gp/referral', express.static(path.join(__dirname, '../public/gp/referral.html')));
router.use('/gp/history', express.static(path.join(__dirname, '../public/gp/history.html')));
router.use('/gp/history-all', express.static(path.join(__dirname, '../public/gp/all-history.html')));
router.use('/gp/profile', express.static(path.join(__dirname, '../public/gp/profile.html')));
router.use('/gp/referral/*', express.static(path.join(__dirname, '../public/gp/referral-detail.html')));

router.use('/physician/referral', express.static(path.join(__dirname, '../public/physician/referral.html')));
router.use('/physician/all-referral', express.static(path.join(__dirname, '../public/physician/all-history.html')));
router.use('/physician/schedule', express.static(path.join(__dirname, '../public/physician/schedule.html')));
router.use('/physician/profile', express.static(path.join(__dirname, '../public/physician/profile.html')));
router.use('/physician/referral-wait/*', express.static(path.join(__dirname, '../public/physician/referral-detail-waiting.html')));
router.use('/physician/referral/*', express.static(path.join(__dirname, '../public/physician/referral-detail.html')));

module.exports = router;
