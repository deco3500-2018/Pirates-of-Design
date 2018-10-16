/*
The code snippet below has been adapted from

Node JS Configuration
https://www.youtube.com/watch?v=uONz0lEWft0&list=PLillGF-RfqbZMNtaOXJQiDebNXjVapWPZ

I have used their reference to make my own function. The function here is connected to the node js server.
*/

const mongoose = require('mongoose');
const config = require('../config/database');

const HospitalSchema = mongoose.Schema({
  name: {
    type:String,
    required: true
  },
  address: {
    type:String,
    required: true
  },
  phonum: {
    type: String,
    required: true
  }
}, {strict: false});

const Hospital = module.exports = mongoose.model('Hospital', HospitalSchema);

module.exports.getHospitalById = function(id, callback) {
  Hospital.findById(id, callback);
}

module.exports.addHospital = function(newHospital, callback){
  newHospital.save(callback);
}

module.exports.removeHospitalById = function(d_id, callback){
  Hospital.deleteOne({id: d_id}, callback);
}

module.exports.updateHospitalById = function(u_hospital, callback){
  const condition = {
    name: u_hospital.name,
    address: u_hospital.address,
    phonum: u_hospital.phonum
  };
  console.log(condition);
  Hospital.findByIdAndUpdate(
    u_hospital._id,
    condition,
    callback
  );
}
