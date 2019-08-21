const mongoose = require('mongoose');

const TravelSchema = new mongoose.Schema({
  departureAirport: {
    type: 'Airport',
    required: true
  },
  boardingAt: {
    type: Date,
    required: true
  },
  arrivalAirport: {
    type: 'Airport',
    required: true
  },
  arrivingAt: {
    type: Date,
    required: true
  }
});

const Travel = mongoose.model('Travel', TravelSchema);

module.exports = Travel;
