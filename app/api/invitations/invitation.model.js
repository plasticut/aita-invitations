const mongoose = require('mongoose');
const _ = require('lodash');

const {ObjectId} = mongoose.Schema.Types;

const InvitationSchema = new mongoose.Schema({
  traveler: {
    type: ObjectId,
    ref: 'Traveler',
    required: true
  },
  event: {
    type: ObjectId,
    ref: 'Event',
    required: true
  },
  activated: {
    type: Boolean,
    default: false,
    required: true
  },
  sended: {
    type: Boolean,
    default: false,
    required: true
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

const Invitation = mongoose.model('Invitation', InvitationSchema);

Invitation.toJSON = function(items, options) {
  const isArray = Array.isArray(items);

  if (!isArray) {
    items = [items];
  }

  items = items.map((item) => item.toJSON(options));

  return isArray ? items : items[0];
};

module.exports = Invitation;
