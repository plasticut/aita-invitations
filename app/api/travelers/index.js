const Router = require('koa-router');

const {listTravelers} = require('./listTravelers');

const router = new Router();

router.get('/', listTravelers);

module.exports = router;
