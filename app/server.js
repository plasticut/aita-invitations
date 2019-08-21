const config = require('config');

const app = require('./app');
const mongoose = require('./libs/mongoose');
const socketIo = require('./socketIo');

require('./sockets/boarding/boarding.handler');
require('./sockets/map/map.handler');

const PORT = config.get('port');
const HOST = config.get('host');
const server = app.listen(PORT, HOST);

socketIo.attach(server);

server.on('listening', async () => {
  await mongoose.waitConnection();

  module.parent && process.send('ready');

  console.log(`SERVER LISTENING: http://${HOST}:${PORT}`);
  if (config.util.getEnv('NODE_ENV') === 'development') {
  }
});

module.exports = server;
