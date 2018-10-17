const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();
const users = require('./routes/users');
const hospitals = require('./routes/hospitals');
const referrals = require('./routes/referrals');
const schedules = require('./routes/schedules');
const frontend = require('./routes/frontend');
const port = 3000;
const config = require('./config/database');

//Connect with database
mongoose.connect(config.database, { useNewUrlParser: true });

//On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+ config.database);
})

//Database Error log
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+ err);
})

// Cookie parser
app.use(cookieParser());

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//CORS Middleware
app.use(cors());

//Body Parser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//Users Route
app.use('/users',users);

//Hospitals Route
app.use('/hospital',hospitals);

//Referrals Route
app.use('/referral',referrals);

//Schedules Route
app.use('/schedules',schedules);

//Static Folder
app.all('*', frontend);

//Route
app.get('/test', (req, res) => {
  res.send('Testing Testing 3');
})

app.listen(port, () => {
  console.log('Server started on port '+ port);
})
