const mongoose = require('mongoose');
const _ = require('lodash');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  startDate: {
    type: Date
  }
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

const Event = mongoose.model('Event', EventSchema);

Event.toJSON = function(items, options) {
  const isArray = Array.isArray(items);

  if (!isArray) {
    items = [items];
  }

  items = items.map((item) => item.toJSON(options));

  return isArray ? items : items[0];
};

module.exports = Event;
