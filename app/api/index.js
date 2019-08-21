const Router = require('koa-router');

const invitationsRouter = require('./invitations');
const eventsRouter = require('./events');
const travelersRouter = require('./travelers');

const router = new Router({prefix: '/api/v1'});

router.use('/invitations', invitationsRouter.routes());
router.use('/events', eventsRouter.routes());
router.use('/travelers', travelersRouter.routes());

module.exports = router;
