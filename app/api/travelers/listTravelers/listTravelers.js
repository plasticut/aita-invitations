const Traveler = require('../traveler.model');

module.exports = {listTravelers};

async function listTravelers(ctx) {
  const travelers = await Traveler.find();

  ctx.body = Traveler.toJSON(travelers);

  ctx.status = 200;
}
