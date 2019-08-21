const socketIo = require('socket.io');

const io = socketIo({
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

module.exports = io;
