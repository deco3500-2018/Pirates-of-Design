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
const path = require('path');

router.get('/example', function (req, res) {
  res.send('Hello SomeRoute!');
});

router.use('/', express.static(path.join(__dirname, '../public')));
router.use('/signup', express.static(path.join(__dirname, '../public/signup.html')));
router.use('/login', express.static(path.join(__dirname, '../public/login.html')));

router.use('/gp/referral', express.static(path.join(__dirname, '../public/gp/referral.html')));
router.use('/gp/history', express.static(path.join(__dirname, '../public/gp/history.html')));
router.use('/gp/profile', express.static(path.join(__dirname, '../public/gp/profile.html')));

router.use('/physician/referral', express.static(path.join(__dirname, '../public/physician/referral.html')));
router.use('/physician/schedule', express.static(path.join(__dirname, '../public/physician/schedule.html')));
router.use('/physician/profile', express.static(path.join(__dirname, '../public/physician/profile.html')));

module.exports = router;
