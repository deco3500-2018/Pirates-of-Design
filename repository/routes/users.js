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
const User = require('../models/User');
const config = require('../config/database');

//Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phonum: req.body.phonum,
    medicalnum: req.body.medicalnum,
    experience: req.body.experience,
    estimate_cost: req.body.estimate_cost,
    isPhysician: req.body.isPhysician,
    hospitalId: req.body.hospitalId
  });

  User.addUser( newUser, (err, user)=>{
    if (err){
      res.json({sucess: false, msg: 'Failed to register user', error: err})
    } else {
      res.json({success: true, msg: 'User registered'})
    }
  })
});


// Authenticate
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'bearer '+token,
          user: user
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

// Get all users
router.get('/usersList', function(req, res){
  User.find({}, ['name', 'email', 'phonum', 'medicalnum', 'experience', 'estimate_cost', 'isPhysician', 'hospitalId'], function(err,users){
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });

    res.send(userMap);
  });
});

// Get all users
router.get('/getPhysicians', function(req, res){
  User.find({'isPhysician':1}, ['name', 'email', 'phonum', 'medicalnum', 'experience', 'estimate_cost', 'isPhysician', 'hospitalId'], function(err,users){
    res.send(users);
  });
});


// Delete UserS
router.post('/deleteUser', (req, res, next) => {
  const d_email = req.body.email;
  User.removeUserByEmail(d_email, (err, user) => {
    res.json({success:true, data: user});
  });
});

// Update Users
router.post('/updateUser', (req, res, next) => {
  const u_user = req.body;
  User.updateUserById(u_user, (err, user) => {
    res.json({success:true, data: user});
  });
})

module.exports = router;
