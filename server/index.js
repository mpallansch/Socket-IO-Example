const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const mainApp = express();
const ioApp = express();
const server = require('http').createServer(ioApp);
const io = require('socket.io')(server, {
    cors: {
        origins: '*'
    }
});
const mainPort = 3001;
const ioPort = 8080;

const allowCors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //TODO, change this value
  next();
};

const authenticateUser = (requestBody) => { //TODO, fully implement this method
  if (requestBody.username === 'matt' && requestBody.password === '123') {
      return new User('flooredmatt')
  }
  if (requestBody.username === 'danni' && requestBody.password === '123') {
      return new User('danman')
  }
  if (requestBody.username === 'joe' && requestBody.password === '123') {
      return new User('G1Joseph')
  }
  if (requestBody.username === 'dad' && requestBody.password === '123') {
      return new User('workaholic')
  }
  return false;
}

class User { //TODO, move this to another file
  constructor(username) {
    this.username = username;
  }
}

mainApp.use( multer( {} ).any() );
mainApp.use(session({
  secret: 'super secure app secret', //TODO, change this value
  cookie: {  } 
}));

if (mainApp.get('env') === 'production') {
  sess.cookie.secure = true;
}

mainApp.post('/login', allowCors, (req, res) => {
  if (user = authenticateUser(req.body)) {
      req.session.username = user.username;
      res.send(200, '{"username": "' + user.username + '"}');
  }
  res.send(401, '{"message": "Invalid username or password"}');
});

mainApp.listen(mainPort, () => {
  console.log('Server running on port ' + mainPort);
});

server.listen(ioPort, () => {});

let players = {room1: {}, room2: {}};

io.on('connection', (socket) => { 
  console.log('Adding client to room ' + socket.handshake.query['room']);
    socket.join(socket.handshake.query['room']);

    socket.on('event', (data) => {
        players[socket.handshake.query['room']][data.username] = [data.x, data.y];
        io.sockets.to(socket.handshake.query['room']).emit('event', players[socket.handshake.query['room']]);
    });
});