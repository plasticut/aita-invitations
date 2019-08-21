const path = require('path');
const Pug = require('koa-pug');
const moment = require('moment');

const pug = new Pug({
  viewPath: path.resolve(__dirname, '../'),
  locals: {
    moment
  },
  helperPath: [
    {moment}
  ]
  // basedir: 'path/for/pug/extends'
});

module.exports = pug;
