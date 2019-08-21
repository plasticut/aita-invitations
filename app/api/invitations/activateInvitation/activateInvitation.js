const Invitation = require('../invitation.model');
const NotFoundError = require('../../../errors/NotFoundError');
const ValidationError = require('../../../errors/ValidationError');
const {NOT_FOUND, VALIDATION} = require('../../../errors/codes');
const {checkObjectIdField} = require('../../../libs/validators');

module.exports = {activateInvitation};

async function activateInvitation(ctx) {
  const {invitationId} = ctx.params;

  checkObjectIdField(ctx.params, 'invitationId');

  const invitation = await Invitation.findOne({_id: invitationId})
      .populate('traveler')
      .populate('event');

  if (!invitation) {
    throw new NotFoundError(NOT_FOUND.INVITATION);
  }

  if (invitation.activated) {
    throw new ValidationError(VALIDATION.INVITATION_ACTIVATED);
  }

  invitation.activated = true;
  await invitation.save();

  ctx.body = invitation.toJSON();
  ctx.status = 200;
}
