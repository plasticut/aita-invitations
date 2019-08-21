const Event = require('../../api/events/event.model');

module.exports = function(factory) {
  factory.define('Event', Event, {
    name: factory.chance('word'),
    address: factory.chance('address'),
    startDate: factory.chance('date')
  }, {
  });
};
