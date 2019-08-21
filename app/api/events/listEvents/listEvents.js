const Event = require('../event.model');

module.exports = {listEvents};

async function listEvents(ctx) {
  const events = await Event.find();

  ctx.body = Event.toJSON(events);
  ctx.status = 200;
}
