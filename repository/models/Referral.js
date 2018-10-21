/*
The code snippet below has been adapted from

Node JS Configuration
https://www.youtube.com/watch?v=uONz0lEWft0&list=PLillGF-RfqbZMNtaOXJQiDebNXjVapWPZ

I have used their reference to make my own function. The function here is connected to the node js server.
*/

const mongoose = require('mongoose');
const config = require('../config/database');
const Schema = mongoose.Schema;

const ReferralSchema = mongoose.Schema({
  name: {
    type:String,
    required: true
  },
  patient_name: {
    type:String,
    required: true
  },
  patient_address: {
    type: String,
    required: true
  },
  patient_phonum: {
    type: String,
    required: true
  },
  patient_dob: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  gp_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  state: {
    type: Number,
    required: true
  },
  physician_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  category: {
    type: String,
    required: true
  }

}, {timestamps: { createdAt: 'created_at' }});

const Referral = module.exports = mongoose.model('Referral', ReferralSchema);

module.exports.getReferralById = function(id, callback) {
  Referral.findById(id, callback);
}

module.exports.addReferral = function(newReferral, callback){
  newReferral.save(callback);
}

module.exports.removeReferralById = function(d_id, callback){
  Referral.deleteOne({id: d_id}, callback);
}

module.exports.updateReferralById = function(u_referral, callback){
  const condition = {
    name: u_referral.name,
    patient_name: u_referral.patient_name,
    patient_address: u_referral.patient_address,
    patient_phonum: u_referral.patient_phonum,
    patient_dob: u_referral.patient_dob,
    description: u_referral.description,
    gp_id: u_referral.gp_id,
    state: u_referral.state,
    physician_id: u_referral.physician_id,
    category: u_referral.category
  };
  console.log(condition);
  Referral.findByIdAndUpdate(
    u_referral._id,
    condition,
    callback
  );
}
