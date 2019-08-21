const config = require('config');
const mongoose = require('mongoose');
const logger = require('./logger')(module).child({level: 'error'});

mongoose.Promise = global.Promise;

if (config.get('mongoose.debug')) {
  mongoose.set('debug', true);
}

const mongooseOptions = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  ...config.get('mongoose.options')
};

mongoose.connect(config.get('mongoose.uri'), mongooseOptions).catch((err) => logger.fatal(err));

mongoose.connection.on('error', (err) => {
  if (err.name === 'MongoNetworkError' && err.message.includes('first connect')) {
    return setTimeout(() => {
      mongoose.connect(config.get('mongoose.uri'), mongooseOptions).catch((err) => logger.fatal(err));
    }, 1000);
  }
});

module.exports = Object.assign(mongoose, {
  waitConnection() {
    return new Promise((resolve) => {
      if (mongoose.connection.readyState === mongoose.Connection.STATES.connected) {
        return resolve(mongoose.connection);
      }

      mongoose.connection.once('open', () => resolve(mongoose.connection));
    });
  }
});
