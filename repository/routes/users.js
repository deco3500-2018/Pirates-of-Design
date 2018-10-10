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
    username: req.body.username,
    password: req.body.password
  });

  User.addUser( newUser, (err, user)=>{
    if (err){
      res.json({sucess: false, msg: 'Failed to register user'})
    } else {
      res.json({success: true, msg: 'User registered'})
    }
  })
});


// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
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
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
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
  User.find({}, ['name', 'email', 'username'], function(err,users){
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });

    res.send(userMap);
  });
});

// Delete UserS
router.post('/deleteUser', (req, res, next) => {
  const d_username = req.body.username;
  User.removeUserByUsername(d_username, (err, user) => {
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
