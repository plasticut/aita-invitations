const pug = require('pug');
const uglify = require('uglify-js');
const fs = require('fs');

const mapTemplate = pug.compileFile(`${__dirname}/map.template.pug`, {basedir: 'app/pages'});
const script = uglify.minify(fs.readFileSync(`${__dirname}/map.client.js`).toString()).code;

const HOUR = 60 * 60 * 1000;

module.exports = {renderMap};

async function renderMap(ctx) {
  const locals = {
    title: 'Flights map',
    script,
    name: '',
    distance: '',
    hours: ''
  };

  ctx.body = mapTemplate(locals);
  ctx.type = 'html';
}
