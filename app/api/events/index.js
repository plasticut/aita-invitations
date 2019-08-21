const Router = require('koa-router');

const {listEvents} = require('./listEvents');

const router = new Router();

router.get('/', listEvents);

module.exports = router;
