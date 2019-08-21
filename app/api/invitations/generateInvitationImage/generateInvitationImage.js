const Invitation = require('../invitation.model');
const NotFoundError = require('../../../errors/NotFoundError');
const {NOT_FOUND} = require('../../../errors/codes');
const invitationService = require('../invitation.service');
const {checkObjectIdField} = require('../../../libs/validators');

module.exports = {generateInvitationImage};

async function generateInvitationImage(ctx) {
  const {invitationId} = ctx.params;
  const imageType = ctx.request.query.imageType || 'png';

  checkObjectIdField(ctx.params, 'invitationId');

  const invitation = await Invitation.findById(invitationId)
      .populate('traveler')
      .populate('event');

  if (!invitation) {
    throw new NotFoundError(NOT_FOUND.INVITATION);
  }

  const invitationImage = await invitationService.generateInvitationImage({
    invitation,
    event: invitation.event,
    traveler: invitation.traveler,
    imageType
  });

  const filename = `${invitation.traveler.fullName} invitation.${imageType}`;

  ctx.set('content-disposition', `attachment; filename=${encodeURIComponent(filename)}`);
  ctx.type = imageType;
  ctx.body = invitationImage;
  ctx.status = 200;
}
