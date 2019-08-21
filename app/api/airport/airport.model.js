const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const AirportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: PointSchema,
    required: true
  }
});

const Airport = mongoose.model('Airport', AirportSchema);

module.exports = Airport;
