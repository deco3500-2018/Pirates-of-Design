const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const http = require('http');

const app = express();
const users = require('./routes/Users');
const hospitals = require('./routes/Hospitals');
const referrals = require('./routes/Referrals');
const schedules = require('./routes/Schedules');
const frontend = require('./routes/Frontend');
const port = process.env.PORT || 3000;
const config = require('./config/database');

const server = http.createServer(app);
const io = require('socket.io').listen(server);

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

var numUsers = 0;

// socket
// app.set('socketio', io);
io.on('connection', function(socket){
  var addedUser = false;

  socket.on('add user', (username) => {
    if (addedUser) return;

    socket.on('new message', (data) => {
      // we tell the client to execute 'new message'
      socket.broadcast.emit('new message', {
        username: socket.username,
        message: data
      });
    });

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  socket.on('chat message', function(msg){
    var userColorClass = "greenText";
    if( socket.username === "root" ) {
        userColorClass = "blueText";
    }
    console.log('message: ' + msg);
    io.emit('chat message', {
      message: msg,
      colorClass: userColorClass,
      username: socket.username
    });

  });
});

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

server.listen(port, () => {
  console.log('Server started on port '+ port);
})
