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
const Hospital = require('../models/Hospital');
const config = require('../config/database');



//Register
router.post('/addHospital', (req, res, next) => {
  let newHospital = new Hospital({
    name: req.body.name,
    address: req.body.address,
    phonum: req.body.phonum
  });

  Hospital.addHospital( newHospital, (err, Hospital)=>{
    if (err){
      res.json({sucess: false, msg: 'Failed to register Hospital', error: err})
    } else {
      res.json({success: true, msg: 'Hospital registered'})
    }
  })
});

// Get all Hospitals
router.get('/hospitalList', function(req, res){
  console.log('test');
  Hospital.find({}, ['name', 'address', 'phonum'], function(err,Hospitals){
    var HospitalMap = {};

    Hospitals.forEach(function(Hospital) {
      HospitalMap[Hospital._id] = Hospital;
    });

    res.send(Hospitals);
  });
});

// get hospital info
router.post('/hospitalinfo', function (req, res){
  const u_id = req.body.id;

  Hospital.find({'_id':u_id}, ['name', 'address'], function(err,hospital){
    res.send(hospital);
  })
});

// Delete HospitalS
router.post('/deleteHospital', (req, res, next) => {
  const d_id = req.body._id;
  Hospital.findByIdAndRemove(d_id, (err, Hospital) => {
    res.json({success:true, data: Hospital});
  });
});

// Update Hospitals
router.post('/updateHospital', (req, res, next) => {
  const u_Hospital = req.body;
  Hospital.findByIdAndUpdate(u_Hospital._id, u_Hospital, (err, Hospital) => {
    res.json({success:true, data: Hospital});
  });
})

module.exports = router;
