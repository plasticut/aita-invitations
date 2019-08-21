const Router = require('koa-router');

const {createInvitation} = require('./createInvitation');
const {getInvitation} = require('./getInvitation');
const {listInvitations} = require('./listInvitations');
const {generateInvitationImage} = require('./generateInvitationImage');
const {activateInvitation} = require('./activateInvitation');

const router = new Router();

router.post('/', createInvitation);
router.get('/', listInvitations);
router.get('/:invitationId', getInvitation);
router.get('/:invitationId/image', generateInvitationImage);
router.post('/:invitationId/activate', activateInvitation);

module.exports = router;
