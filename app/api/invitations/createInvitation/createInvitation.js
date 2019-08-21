const Invitation = require('../invitation.model');
const Traveler = require('../../travelers/traveler.model');
const Event = require('../../events/event.model');
const NotFoundError = require('../../../errors/NotFoundError');
const {NOT_FOUND} = require('../../../errors/codes');
const {checkObjectIdField, checkRequiredField} = require('../../../libs/validators');

module.exports = {createInvitation};

async function createInvitation(ctx) {
  const {body} = ctx.request;

  const traveler = await Traveler.findById(body.travelerId);

  if (!traveler) {
    throw new NotFoundError(NOT_FOUND.TRAVELER);
  }

  const event = await Event.findById(body.eventId);

  if (!event) {
    throw new NotFoundError(NOT_FOUND.EVENT);
  }

  const invitation = new Invitation({
    event,
    traveler
  });

  await invitation.save();

  ctx.body = invitation.toJSON();
  ctx.status = 201;
}
