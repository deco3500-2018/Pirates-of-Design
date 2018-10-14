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
router.use('/about', express.static(path.join(__dirname, '../public/about.html')));

module.exports = router;
