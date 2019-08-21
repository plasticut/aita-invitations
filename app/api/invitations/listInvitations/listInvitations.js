const Invitation = require('../invitation.model');

module.exports = {listInvitations};

async function listInvitations(ctx) {
  const invitations = await Invitation.find();

  ctx.body = Invitation.toJSON(invitations);

  ctx.status = 200;
}
