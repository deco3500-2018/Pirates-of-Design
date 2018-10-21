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
const Referral = require('../models/Referral');
const config = require('../config/database');

//Register
router.post('/addReferral', (req, res, next) => {
  let newReferral = new Referral({
    name: req.body.name,
    patient_name: req.body.patient_name,
    patient_address: req.body.patient_address,
    patient_phonum: req.body.patient_phonum,
    patient_dob: req.body.patient_dob,
    description: req.body.description,
    gp_id: req.body.gp_id,
    state: req.body.state,
    physician_id: req.body.physician_id,
    category: req.body.category
  });

  Referral.addReferral( newReferral, (err, Referral)=>{
    if (err){
      res.json({sucess: false, msg: 'Failed to register Referral', error: err})
    } else {
      res.json({success: true, msg: 'Referral registered'})
    }
  })
});

// Get all Referrals
router.get('/referralList', function(req, res){
  console.log('test');
  Referral.find({}, ['name', 'patient_name', 'patient_address', 'patient_phonum', 'patient_dob', 'description', 'gp_id', 'state', 'physician_id', 'created_at', 'category'], { sort: {created_at: -1}} ,function(err,Referrals){
    var ReferralMap = {};

    Referrals.forEach(function(Referral) {
      ReferralMap[Referral._id] = Referral;
    });

    res.send(Referrals);
  });
});

// Get state 1 = waiting
router.get('/referwait', function(req, res){
  Referral.find({'state':1}, ['name', 'patient_name', 'patient_address', 'patient_phonum', 'patient_dob', 'description', 'gp_id', 'state', 'physician_id', 'created_at', 'category'], { sort: {created_at: -1}} , function(err,Referrals){
    var ReferralMap = {};

    Referrals.forEach(function(Referral) {
      ReferralMap[Referral._id] = Referral;
    });

    res.send(Referrals);
  });
});

// Get state 2 = approved
router.get('/referapproved', function(req, res){
  console.log('test');
  Referral.find({'state':2}, ['name', 'patient_name', 'patient_address', 'patient_phonum', 'patient_dob', 'description', 'gp_id', 'state', 'physician_id', 'created_at', 'category'] , { sort: {created_at: -1}}, function(err,Referrals){
    var ReferralMap = {};

    Referrals.forEach(function(Referral) {
      ReferralMap[Referral._id] = Referral;
    });

    res.send(Referrals);
  });
});


// Delete ReferralS
router.post('/deleteReferral', (req, res, next) => {
  const d_id = req.body._id;
  Referral.findByIdAndRemove(d_id, (err, Referral) => {
    res.json({success:true, data: Referral});
  });
});

// Update Referrals
router.post('/updateReferral', (req, res, next) => {
  const u_Referral = req.body;
  Referral.findByIdAndUpdate(u_Referral._id, u_Referral, (err, Referral) => {
    res.json({success:true, data: Referral, error: err});
  });
})

module.exports = router;
