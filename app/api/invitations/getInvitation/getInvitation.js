const Invitation = require('../invitation.model');
const NotFoundError = require('../../../errors/NotFoundError');
const {NOT_FOUND} = require('../../../errors/codes');
const {checkObjectIdField} = require('../../../libs/validators');

module.exports = {getInvitation};

async function getInvitation(ctx) {
  const {invitationId} = ctx.params;

  checkObjectIdField(ctx.params, 'invitationId');

  const invitation = await Invitation.findById(invitationId)
      .populate('traveler')
      .populate('event');

  if (!invitation) {
    throw new NotFoundError(NOT_FOUND.INVITATION);
  }

  ctx.body = invitation.toJSON();
  ctx.status = 200;
}
