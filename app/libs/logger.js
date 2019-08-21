const path = require('path');
const bunyan = require('bunyan');
const appPackage = require('../../package.json');

const logger = bunyan.createLogger({
  name: appPackage.name,
  version: appPackage.version
});

module.exports = (module) => {
  const childLogger = logger.child({
    moduleName: path.relative(path.join(__dirname, '..'), module.filename)
  });

  return childLogger;
};
