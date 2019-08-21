const Router = require('koa-router');

const {renderDefault} = require('./default');
const {renderBoarding} = require('./boarding');
const {renderMap} = require('./map');

const router = new Router();

router.get('/', renderDefault);
router.get('/boarding', renderBoarding);
router.get('/map', renderMap);

module.exports = router;
