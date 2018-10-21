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
const Schedule = require('../models/Schedule');
const config = require('../config/database');

//Register
router.post('/addSchedule', (req, res, next) => {
  let newSchedule = new Schedule({
    name: req.body.name,
    description: req.body.description,
    start_date: req.body.start_date,
    end_date: req.body.end_date
  });

  Schedule.addSchedule( newSchedule, (err, Schedule)=>{
    if (err){
      res.json({sucess: false, msg: 'Failed to register Schedule', error: err})
    } else {
      res.json({success: true, msg: 'Schedule registered'})
    }
  })
});

// Get all Schedules
router.get('/scheduleList', function(req, res){
  console.log('test');
  Schedule.find({}, ['name','description', 'start_date', 'end_date'], function(err,Schedules){
    var ScheduleMap = {};

    Schedules.forEach(function(Schedule) {
      ScheduleMap[Schedule._id] = Schedule;
    });

    res.send(Schedules);
  });
});

// Delete ScheduleS
router.post('/deleteSchedule', (req, res, next) => {
  const d_id = req.body._id;
  Schedule.findByIdAndRemove(d_id, (err, Schedule) => {
    res.json({success:true, data: Schedule});
  });
});

// Update Schedules
router.post('/updateSchedule', (req, res, next) => {
  const u_Schedule = req.body;
  Schedule.findByIdAndUpdate(u_Schedule._id, u_Schedule, (err, Schedule) => {
    res.json({success:true, data: Schedule});
  });
})

module.exports = router;
