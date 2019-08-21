const Traveler = require('../../api/travelers/traveler.model');

module.exports = function(factory) {
  factory.define('Traveler', Traveler, {
    firstName: factory.chance('first'),
    lastName: factory.chance('last'),
    statistics: {
      distance: factory.chance('integer', {min: 1, max: 1000000}),
      hours: factory.chance('integer', {min: 1, max: 1000})
    }
  }, {
  });
};
