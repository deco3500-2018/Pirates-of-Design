/*
The code snippet below has been adapted from

Node JS Configuration
https://www.youtube.com/watch?v=uONz0lEWft0&list=PLillGF-RfqbZMNtaOXJQiDebNXjVapWPZ

I have used their reference to make my own function. The function here is connected to the node js server.
*/

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
  name: {
    type:String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phonum: {
    type: String,
    required: true
  },
  medicalnum: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  estimate_cost: {
    type: Number,
    required: true
  },
  isPhysician: {
    type: Boolean,
    required: true
  },
  hospitalId: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital'
  }
}, {strict: false});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.getUserByEmail = function(email, callback){
  const query = {email: email};
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(password, hash, callback){
  bcrypt.compare(password, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
}

module.exports.removeUserByEmail = function(d_email, callback){
  User.deleteOne({email: d_email}, callback);
}

module.exports.updateUserById = function(u_user, callback){
  const condition = {
    name: u_user.name,
    email: u_user.email,
    phonum: u_user.phonum,
    medicalnum: u_user.medicalnum,
    experience: u_user.experience,
    estimate_cost: u_user.estimate_cost,
    isPhysician: u_user.isPhysician,
    hospitalId: u_user.hospitalId
  };
  console.log(condition);
  User.findByIdAndUpdate(
    u_user._id,
    condition,
    callback
  );
}
