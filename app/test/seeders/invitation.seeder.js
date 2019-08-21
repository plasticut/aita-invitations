const Invitation = require('../../api/invitations/invitation.model');

module.exports = function(factory) {
  factory.define('Invitation', Invitation, {
    activated: factory.chance('bool'),
    sended: factory.chance('bool')
  }, {
  });
};
