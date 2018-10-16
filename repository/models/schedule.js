/*
The code snippet below has been adapted from

Node JS Configuration
https://www.youtube.com/watch?v=uONz0lEWft0&list=PLillGF-RfqbZMNtaOXJQiDebNXjVapWPZ

I have used their reference to make my own function. The function here is connected to the node js server.
*/

const mongoose = require('mongoose');
const config = require('../config/database');
const Schema = mongoose.Schema;

const ScheduleSchema = mongoose.Schema({
  name: {
    type:String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  }

}, {strict: false, timestamp: true});

const Schedule = module.exports = mongoose.model('Schedule', ScheduleSchema);

module.exports.getScheduleById = function(id, callback) {
  Schedule.findById(id, callback);
}

module.exports.addSchedule = function(newSchedule, callback){
  newSchedule.save(callback);
}

module.exports.removeScheduleById = function(d_id, callback){
  Schedule.deleteOne({id: d_id}, callback);
}

module.exports.updateScheduleById = function(u_schedule, callback){
  const condition = {
    name: u_schedule.name,
    description: u_schedule.description,
    start_date: u_schedule.start_date,
    end_date: u_schedule.start_date
  };
  console.log(condition);
  Schedule.findByIdAndUpdate(
    u_schedule._id,
    condition,
    callback
  );
}
