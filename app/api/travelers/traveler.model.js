const mongoose = require('mongoose');
const _ = require('lodash');

const TravelerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  statistics: {
    distance: {
      type: Number,
      min: 0
    },
    hours: {
      type: Number,
      min: 0
    }
  },
  travels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Travel'
  }]
}, {
  timestamps: true,
  toJSON: {
    transform(doc, output) {
      output.id = output._id;

      return _.omit(output, [
        '_id',
        '__v',
        'createdAt',
        'updatedAt'
      ]);
    }
  }
});

TravelerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const Traveler = mongoose.model('Traveler', TravelerSchema);

Traveler.toJSON = function(items, options) {
  const isArray = Array.isArray(items);

  if (!isArray) {
    items = [items];
  }

  items = items.map((item) => item.toJSON(options));

  return isArray ? items : items[0];
};

module.exports = Traveler;
